
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

// Connect to MongoDB
db.connectDB();

// Use Routes
app.use('/api/inventory', require('./src/routes/inventory'));

const port = process.env.PORT || 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
