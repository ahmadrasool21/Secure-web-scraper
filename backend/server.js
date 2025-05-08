const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const scrapeRoutes = require('./routes/scrapeRoutes');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const authRoutes = require('./routes/authRoutes');

const app = express();

app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true       
}));
app.use(cookieParser());
app.use(express.json());

app.use('/api/auth', authRoutes);

app.use('/api/scrape', scrapeRoutes);


app.use('/files', express.static(path.join(__dirname, 'files')));


sequelize.sync().then(() => {
  console.log("SQLite DB synced");
  app.listen(5000, () => console.log("Server running on port 5000"));
});
