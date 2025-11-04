const mongoose = require('mongoose');

const userPreferencesSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
  },
  targetCalories: {
    type: Number,
    default: 2000,
  },
  targetProtein: {
    type: Number,
    default: 50,
  },
  targetFat: {
    type: Number,
    default: 70,
  },
  targetSodium: {
    type: Number,
    default: 2300,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('UserPreferences', userPreferencesSchema);
