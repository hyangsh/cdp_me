const UserPreferences = require('../models/UserPreferences');

// @desc    Get user preferences
// @route   GET /api/preferences
// @access  Private
exports.getPreferences = async (req, res, next) => {
  const userId = "68fce1de61c6781a57e715ab"; // Mock user ID

  try {
    let preferences = await UserPreferences.findOne({ user: userId });

    if (!preferences) {
      preferences = await UserPreferences.create({ user: userId });
    }

    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    next(error);
  }
};

// @desc    Update user preferences
// @route   PUT /api/preferences
// @access  Private
exports.updatePreferences = async (req, res, next) => {
  const userId = "68fce1de61c6781a57e715ab"; // Mock user ID
  const { targetCalories, targetProtein, targetFat, targetSodium } = req.body;

  try {
    let preferences = await UserPreferences.findOne({ user: userId });

    if (!preferences) {
      preferences = await UserPreferences.create({ user: userId });
    }

    preferences.targetCalories = targetCalories || preferences.targetCalories;
    preferences.targetProtein = targetProtein || preferences.targetProtein;
    preferences.targetFat = targetFat || preferences.targetFat;
    preferences.targetSodium = targetSodium || preferences.targetSodium;

    await preferences.save();

    res.status(200).json({ success: true, data: preferences });
  } catch (error) {
    next(error);
  }
};
