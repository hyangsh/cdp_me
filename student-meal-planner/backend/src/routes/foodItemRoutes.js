const express = require('express');
const router = express.Router();
const {
  getFoodItems,
  createFoodItem,
  getFoodItem,
  updateFoodItem,
  deleteFoodItem,
} = require('../controllers/foodItemController');

// Assume admin middleware for protected routes

router.route('/').get(getFoodItems).post(/* admin, */ createFoodItem);
router.route('/:id').get(getFoodItem).put(/* admin, */ updateFoodItem).delete(/* admin, */ deleteFoodItem);

module.exports = router;
