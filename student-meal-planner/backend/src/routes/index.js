const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const foodItemRoutes = require('./foodItemRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const mealLogRoutes = require('./mealLogRoutes');
const recommendationRoutes = require('./recommendationRoutes');
const trackingRoutes = require('./trackingRoutes');

router.use('/auth', authRoutes);
router.use('/food-items', foodItemRoutes);
router.use('/inventory', inventoryRoutes);
router.use('/meal-logs', mealLogRoutes);
router.use('/recommendations', recommendationRoutes);
router.use('/tracking', trackingRoutes);

module.exports = router;
