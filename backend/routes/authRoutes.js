const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { body } = require('express-validator');
const verifyToken = require('../middleware/authMiddleware');
const loginLimiter = require('../middleware/rateLimiter'); // ✅ Import the rate limiter

// REGISTER
router.post('/register', [
  body('email')
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),
  body('password')
    .isLength({ min: 6 }).withMessage("Password must be at least 6 characters long")
    .trim()
    .escape()
], register);

// LOGIN (with rate limiting and enhanced validation)
router.post('/login', loginLimiter, [
  body('email')
    .isEmail().withMessage("Invalid email")
    .normalizeEmail(),
  body('password')
    .notEmpty().withMessage("Password is required")
    .trim()
    .escape()
], login);

// PROTECTED HOMEPAGE CHECK
router.get('/home', verifyToken, (req, res) => {
  res.json({ msg: "Token valid", user: req.user });
});

// LOGOUT
router.post('/logout', (req, res) => {
  res.clearCookie('token', {
    httpOnly: true,
    secure: false, // Set to true in production with HTTPS
    sameSite: 'Lax'
  });
  res.json({ msg: "Logged out successfully" });
});

module.exports = router;
