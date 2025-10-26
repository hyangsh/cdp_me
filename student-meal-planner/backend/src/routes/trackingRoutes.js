const express = require('express');
const router = express.Router();
const { getDailySummary, getWeeklySummary } = require('../controllers/trackingController');

// All these routes should be protected
router.get('/daily-summary', getDailySummary);
router.get('/weekly-summary', getWeeklySummary);

module.exports = router;
