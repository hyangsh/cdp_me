// @desc    Get daily summary
// @route   GET /api/tracking/daily-summary
// @access  Private
exports.getDailySummary = (req, res, next) => {
  res.status(200).json({ success: true, data: { calories: 0, protein: 0, carbs: 0, fat: 0 } });
};

// @desc    Get weekly summary
// @route   GET /api/tracking/weekly-summary
// @access  Private
exports.getWeeklySummary = (req, res, next) => {
  res.status(200).json({ success: true, data: [] });
};
