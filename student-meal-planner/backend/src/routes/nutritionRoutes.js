const express = require('express');
const router = express.Router();
const { getNutrientGapRecommendations } = require('../controllers/nutritionController');

router.route('/recommendations').get(getNutrientGapRecommendations);

module.exports = router;
