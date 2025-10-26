
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader("Content-Security-Policy", "default-src 'self'; connect-src 'self' http://localhost:3000; script-src 'self' 'unsafe-eval'; style-src 'self' 'unsafe-inline';");
  next();
});
app.use(express.json());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));

// DB Config
const db = require('./src/config/db');

const startServer = async () => {
  try {
    // Connect to MongoDB and wait for it to finish
    await db.connectDB();
    console.log('✅ Step 1: MongoDB Connected...');

    // 루트 경로('/')에 대한 테스트용 핸들러 추가
    app.get('/', (req, res) => {
      res.send('Backend server is running!');
    });

    // Use Routes
    console.log('⏳ Step 2: Loading routes...');
    app.use('/api', require('./src/routes')); // Loads all routes
    console.log('✅ Step 2: Routes loaded.');

    const port = process.env.PORT || 5000;

    console.log('⏳ Step 3: Starting server...');
    app.listen(port, () => console.log(`✅ Step 3: Server started on port ${port}`));
  } catch (err) {
    console.error('Could not connect to MongoDB:', err.message);
    process.exit(1); // Exit process with failure
  }
};

startServer();
