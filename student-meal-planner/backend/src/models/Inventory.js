const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  // 어떤 사용자의 재고인지 식별하기 위해 User 모델을 참조합니다.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  // 어떤 식품인지 식별하기 위해 FoodItem 모델을 참조합니다.
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

// 한 사용자가 동일한 식품을 여러 번 추가하는 것을 방지하기 위해 복합 인덱스 설정
inventorySchema.index({ user: 1, foodItem: 1 }, { unique: true });

module.exports = mongoose.model('Inventory', inventorySchema);
