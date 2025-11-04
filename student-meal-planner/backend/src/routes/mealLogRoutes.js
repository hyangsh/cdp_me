const express = require('express');
const router = express.Router();
const { createMealLog, deleteMealLog, getAllMealLogs } = require('../controllers/mealLogController');

// @route   POST /api/log
router.route('/').post(createMealLog);

// @route   DELETE /api/log/:logId
router.route('/:logId').delete(deleteMealLog);

// @route   GET /api/log/all
router.route('/all').get(getAllMealLogs);

module.exports = router;
