const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  foodItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FoodItem',
    required: true,
  },
  quantity: {
    type: Number,
    required: [true, '수량은 필수 항목입니다.'],
    min: 0,
    default: 1,
  },
  purchaseDate: {
    type: Date,
    default: Date.now,
  },
  expiryDate: {
    type: Date,
  },
}, {
  timestamps: true,
});

inventorySchema.index({ user: 1, foodItem: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
