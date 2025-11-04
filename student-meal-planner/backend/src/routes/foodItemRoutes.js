const express = require('express');
const router = express.Router();
const { getOrCreateFoodItem, fetchAndCreateFoodItem, updateFoodItemNutritionalData } = require('../controllers/foodItemController');

router.route('/').post(getOrCreateFoodItem);
router.route('/fetch').post(fetchAndCreateFoodItem);
router.route('/update-nutritional-data').get(updateFoodItemNutritionalData);

module.exports = router;
