const mongoose = require('mongoose');

const mealLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack'],
    required: true,
  },
  foods: [
    {
      foodItem: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'FoodItem',
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
  totalCalories: {
    type: Number,
    default: 0,
  },
  logDate: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('MealLog', mealLogSchema);
