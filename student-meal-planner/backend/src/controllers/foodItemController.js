// @desc    Get all food items
// @route   GET /api/food-items
// @access  Public
exports.getFoodItems = (req, res, next) => {
  res.status(200).json({ success: true, data: [] });
};

// @desc    Create a food item
// @route   POST /api/food-items
// @access  Admin
exports.createFoodItem = (req, res, next) => {
  res.status(201).json({ success: true, msg: 'Food item created' });
};

// @desc    Get single food item
// @route   GET /api/food-items/:id
// @access  Public
exports.getFoodItem = (req, res, next) => {
  res.status(200).json({ success: true, data: { id: req.params.id } });
};

// @desc    Update a food item
// @route   PUT /api/food-items/:id
// @access  Admin
exports.updateFoodItem = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Food item ${req.params.id} updated` });
};

// @desc    Delete a food item
// @route   DELETE /api/food-items/:id
// @access  Admin
exports.deleteFoodItem = (req, res, next) => {
  res.status(200).json({ success: true, msg: `Food item ${req.params.id} deleted` });
};
