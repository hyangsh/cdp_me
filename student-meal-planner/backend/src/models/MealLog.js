const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: Date.now,
  },
  // 식사 종류 (아침, 점심, 저녁, 간식)
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  // 해당 끼니에 섭취한 음식 목록
  items: [{
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'FoodItem',
      required: true,
    },
    // 섭취량 (e.g., 1개, 0.5인분)
    quantity: {
      type: Number,
      required: true,
      min: 0,
    },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.model('MealLog', mealLogSchema);
