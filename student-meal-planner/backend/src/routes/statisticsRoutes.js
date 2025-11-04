const express = require('express');
const router = express.Router();
const { getWeeklyStats } = require('../controllers/statisticsController');

// @route   GET /api/statistics/weekly
router.route('/weekly').get(getWeeklyStats);

module.exports = router;
