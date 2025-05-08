const express = require('express');
const router = express.Router();
const axios = require('axios');
const cheerio = require('cheerio');
const fs = require('fs-extra');
const path = require('path');
const { exec } = require('child_process');
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');

// Define blocked patterns for SSRF protection
const blockedPatterns = [
  /^http:\/\/localhost/,
  /^http:\/\/127\.\d+\.\d+\.\d+/,
  /^http:\/\/0\.0\.0\.0/,
  /^http:\/\/169\.254\./,
  /^http:\/\/192\.168\./,
  /^http:\/\/10\./,
  /^http:\/\/172\.(1[6-9]|2[0-9]|3[0-1])\./
];

// Route to handle scraping
router.post(
  '/',
  verifyToken,
  [
    body('url')
      .trim()
      .isLength({ max: 2048 }).withMessage('URL too long')
      .isURL({ protocols: ['http', 'https'], require_protocol: true }).withMessage('Invalid URL format')
  ],
  async (req, res) => {
    // Handle validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { url } = req.body;

    // SSRF protection: Block private/internal IPs
    if (blockedPatterns.some((pattern) => pattern.test(url))) {
      return res.status(403).json({ msg: "Access to private/internal IPs is not allowed" });
    }

    try {
      // Axios request with 5-second timeout
      const response = await axios.get(url, { timeout: 5000 });
      const $ = cheerio.load(response.data);
      const text = $('body').text().replace(/\s+/g, ' ').trim();

      const timestamp = Date.now();
      const txtFilename = `scraped_${timestamp}.txt`;
      const zipFilename = `scraped_${timestamp}.zip`;
      const filesDir = path.join(__dirname, '../files');

      await fs.ensureDir(filesDir);
      const txtPath = path.join(filesDir, txtFilename);
      const zipPath = path.join(filesDir, zipFilename);

      await fs.writeFile(txtPath, text);

      const password = Math.random().toString(36).slice(2, 10);

      // Use full path if 7z is not globally available
      const command = `7z a -p${password} "${zipPath}" "${txtPath}"`;

      exec(command, (err, stdout, stderr) => {
        if (err) {
          console.error("7z error:", stderr);
          return res.status(500).json({ msg: "Failed to create ZIP file" });
        }

        fs.unlinkSync(txtPath);
        res.json({
          msg: "Scraping complete",
          file: path.basename(zipPath),
          password: password
        });
      });

    } catch (err) {
      if (err.code === 'ECONNABORTED') {
        console.error("Timeout error:", err.message);
        return res.status(504).json({ msg: "The target website did not respond in time." });
      }

      console.error("Scraping error:", err.message);
      res.status(500).json({ msg: "Scraping failed" });
    }
  }
);

module.exports = router;
