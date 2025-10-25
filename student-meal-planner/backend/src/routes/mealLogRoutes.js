const express = require('express');
const router = express.Router();
const {
  addMealLog,
  getMealLogs,
  getMealLog,
  updateMealLog,
  deleteMealLog,
} = require('../controllers/mealLogController');

// All these routes should be protected
router.route('/').post(addMealLog).get(getMealLogs);
router.route('/:logId').get(getMealLog).put(updateMealLog).delete(deleteMealLog);

module.exports = router;
