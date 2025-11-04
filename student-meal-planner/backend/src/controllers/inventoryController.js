const Inventory = require('../models/Inventory');
const FoodItem = require('../models/FoodItem');

// @desc    Get user inventory
// @route   GET /api/inventory
// @access  Private
exports.getInventory = async (req, res, next) => {
  try {
    const userId = "68fce1de61c6781a57e715ab"; // Mock user ID
    const inventory = await Inventory.find({ user: userId }).populate('foodItem');
    res.status(200).json({ success: true, count: inventory.length, data: inventory });
  } catch (error) {
    next(error);
  }
};

// @desc    Add item to inventory
// @route   POST /api/inventory
// @access  Private
exports.addInventoryItem = async (req, res, next) => {
  try {
    const userId = "68fce1de61c6781a57e715ab"; // Mock user ID
    const { foodItem, quantity } = req.body;

    // Check if foodItem exists
    const existingFoodItem = await FoodItem.findById(foodItem);
    if (!existingFoodItem) {
      return res.status(404).json({ success: false, error: 'FoodItem not found' });
    }

    let inventoryItem = await Inventory.findOne({ user: userId, foodItem: foodItem });

    if (inventoryItem) {
      // If item already exists, update quantity
      inventoryItem.quantity += quantity;
      await inventoryItem.save();
    } else {
      // Else, create new inventory item
      inventoryItem = await Inventory.create({
        user: userId,
        foodItem,
        quantity,
      });
    }

    res.status(201).json({ success: true, data: inventoryItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Update inventory item quantity
// @route   PUT /api/inventory/:inventoryId
// @access  Private
exports.updateInventoryItem = async (req, res, next) => {
  try {
    const { inventoryId } = req.params;
    const { quantity } = req.body;

    const inventoryItem = await Inventory.findByIdAndUpdate(
      inventoryId,
      { quantity },
      { new: true, runValidators: true }
    );

    if (!inventoryItem) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: inventoryItem });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete inventory item
// @route   DELETE /api/inventory/:inventoryId
// @access  Private
exports.deleteInventoryItem = async (req, res, next) => {
  try {
    const { inventoryId } = req.params;

    const inventoryItem = await Inventory.findByIdAndDelete(inventoryId);

    if (!inventoryItem) {
      return res.status(404).json({ success: false, error: 'Inventory item not found' });
    }

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};
