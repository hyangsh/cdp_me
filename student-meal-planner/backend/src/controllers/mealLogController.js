const MealLog = require('../models/MealLog');
const Inventory = require('../models/Inventory');
const mongoose = require('mongoose');

// @desc    Log a meal and deduct inventory
// @route   POST /api/meallogs
// @access  Private
exports.createMealLog = async (req, res, next) => {
  const { userId, mealType, foods, logDate } = req.body; // foods is the originalCombination

  // Basic validation
  if (!userId || !mealType || !foods || !Array.isArray(foods) || foods.length === 0) {
    return res.status(400).json({ success: false, error: 'Missing required fields.' });
  }

  try {
    // 1. Create the MealLog
    const mealLog = new MealLog({
      user: userId,
      mealType,
      foods: foods.map(item => ({ foodItem: item.foodItem._id, quantity: item.usedQuantity })),
      logDate: logDate || new Date(),
    });

    await mealLog.save();

    // 2. Deduct quantities from inventory
    for (const item of foods) {
      const foodItemId = item.foodItem._id;
      const usedQuantity = item.usedQuantity;

      const inventoryItem = await Inventory.findOne({ user: userId, foodItem: foodItemId });

      if (!inventoryItem || inventoryItem.quantity < usedQuantity) {
        throw new Error(`Insufficient inventory for ${item.foodItem.name}.`);
      }

      inventoryItem.quantity -= usedQuantity;
      await inventoryItem.save();
    }

    res.status(201).json({ success: true, data: mealLog });

  } catch (error) {
    console.error('Error creating meal log:', error);
    // Note: If inventory deduction fails after meal log is created, we have inconsistent data.
    // Transactions would prevent this, but are removed for standalone DB compatibility.
    res.status(500).json({ success: false, error: 'Failed to log meal.', details: error.message });
  }
};

// @desc    Delete a meal log
// @route   DELETE /api/log/:logId
// @access  Private
exports.deleteMealLog = async (req, res, next) => {
  const { logId } = req.params;
  const userId = "68fce1de61c6781a57e715ab"; // Mock user ID

  try {
    // 1. Find the MealLog to be deleted
    const mealLog = await MealLog.findOne({ _id: logId, user: userId });

    if (!mealLog) {
      return res.status(404).json({ success: false, message: 'Meal log not found' });
    }

    // 2. Restore the inventory quantity
    for (const item of mealLog.foods) {
      await Inventory.findOneAndUpdate(
        { user: userId, foodItem: item.foodItem },
        { $inc: { quantity: item.quantity } }
      );
    }

    // 3. Delete the MealLog
    await MealLog.deleteOne({ _id: logId, user: userId });

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

// @desc    Get all meal logs for a user
// @route   GET /api/log/all
// @access  Private
exports.getAllMealLogs = async (req, res, next) => {
  const userId = "68fce1de61c6781a57e715ab"; // Mock user ID

  try {
    const mealLogs = await MealLog.find({ user: userId })
      .populate('foods.foodItem')
      .sort({ logDate: -1 });

    res.status(200).json({ success: true, data: mealLogs });
  } catch (error) {
    next(error);
  }
};
