const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '식품 이름은 필수 항목입니다.'],
    unique: true,
    trim: true,
  },
  calories: {
    type: Number,
    required: [true, '칼로리는 필수 항목입니다.'],
    min: 0,
  },
  protein: {
    type: Number,
    default: 0,
    min: 0,
  },
  carbs: {
    type: Number,
    default: 0,
    min: 0,
  },
  fat: {
    type: Number,
    default: 0,
    min: 0,
  },
  sodium: {
    type: Number,
    default: 0,
    min: 0,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
