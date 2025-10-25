
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors());

// DB Config
const db = require('./src/config/db');

const startServer = async () => {
  try {
    // Connect to MongoDB and wait for it to finish
    await db.connectDB();
    console.log('MongoDB Connected...');

    // Use Routes
    app.use('/api', require('./src/routes')); // Loads all routes

    const port = process.env.PORT || 5000;
    app.listen(port, () => console.log(`Server started on port ${port}`));
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();
