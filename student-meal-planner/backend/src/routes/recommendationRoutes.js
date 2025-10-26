const express = require('express');
const router = express.Router();
const { getMealRecommendations } = require('../controllers/recommendationController');

// This route should be protected
router.get('/meals', getMealRecommendations);

module.exports = router;
