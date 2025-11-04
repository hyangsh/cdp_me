const MealLog = require('../models/MealLog');

// @desc    Get weekly statistics
// @route   GET /api/statistics/weekly
// @access  Private
exports.getWeeklyStats = async (req, res, next) => {
  try {
    const userId = "68fce1de61c6781a57e715ab"; // Mock user ID

    // 1. Calculate the start and end of the last 7 days
    const today = new Date();
    const endOfWeek = new Date(today);
    endOfWeek.setHours(23, 59, 59, 999);

    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - 6);
    startOfWeek.setHours(0, 0, 0, 0);

    // 2. Fetch all MealLogs for the current week
    const mealLogs = await MealLog.find({
      user: userId,
      logDate: { $gte: startOfWeek, $lte: endOfWeek },
    }).populate('foods.foodItem');

    // 3. Calculate totals and unique consumed items
    const totals = { calories: 0, protein: 0, fat: 0, sodium: 0 };
    const consumedItems = new Set();

    for (const log of mealLogs) {
      for (const item of log.foods) {
        if (item.foodItem) {
          const { calories, protein, fat, sodium } = item.foodItem;
          const quantity = item.quantity;

          totals.calories += (calories || 0) * quantity;
          totals.protein += (protein || 0) * quantity;
          totals.fat += (fat || 0) * quantity;
          totals.sodium += (sodium || 0) * quantity;

          consumedItems.add(item.foodItem.name);
        }
      }
    }

    // 4. Return the aggregated data
    res.status(200).json({
      success: true,
      data: {
        week: {
          start: startOfWeek.toISOString().split('T')[0],
          end: endOfWeek.toISOString().split('T')[0],
        },
        totals,
        consumedItems: Array.from(consumedItems),
      },
    });

  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    next(error);
  }
};
