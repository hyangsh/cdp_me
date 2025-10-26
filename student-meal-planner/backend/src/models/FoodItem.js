const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '식품 이름은 필수 항목입니다.'],
    trim: true,
    unique: true, // 식품 이름은 중복되지 않도록 설정
  },
  calories: {
    type: Number,
    required: [true, '칼로리는 필수 항목입니다.'],
    min: 0,
  },
  protein: {
    type: Number,
    required: [true, '단백질은 필수 항목입니다.'],
    min: 0,
  },
  carbs: {
    type: Number,
    required: [true, '탄수화물은 필수 항목입니다.'],
    min: 0,
  },
  fat: {
    type: Number,
    required: [true, '지방은 필수 항목입니다.'],
    min: 0,
  },
}, {
  timestamps: true, // createdAt, updatedAt 자동 기록
});

module.exports = mongoose.model('FoodItem', foodItemSchema);
