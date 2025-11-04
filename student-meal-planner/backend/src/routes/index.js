const express = require('express');
const router = express.Router();

router.use('/inventory', require('./inventoryRoutes'));
router.use('/recommendations', require('./recommendationRoutes'));
router.use('/fooditems', require('./foodItemRoutes'));
router.use('/nutrition', require('./nutritionRoutes'));
router.use('/log', require('./mealLogRoutes'));
router.use('/statistics', require('./statisticsRoutes'));
router.use('/preferences', require('./preferencesRoutes'));
// Add other routes here as they are recreated

module.exports = router;