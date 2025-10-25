const Inventory = require('../models/Inventory');

// @desc    Get meal recommendations
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res, next) => {
  try {
    // Note: In a real app, userId would come from an auth middleware (e.g., req.user.id)
    // Using a mock ID for demonstration purposes.
    const userId = "68fce1de61c6781a57e715ab"; // User ID provided by the user. 
    const { mealType = 'lunch' } = req.query;

    // 1. Fetch user's inventory with populated food item details
    const userInventory = await Inventory.find({ user: userId }).populate('foodItem');
    if (!userInventory || userInventory.length === 0) {
      return res.status(200).json({ success: true, data: [], message: '재고가 비어있어 식단을 추천할 수 없습니다.' });
    }
    const availableFoods = userInventory.map(item => item.foodItem);

    // 2. Define nutritional goals for the meal
    const nutritionalGoals = getNutritionalGoals(mealType);

    // 3. Generate all possible meal combinations (simplified approach)
    const mealCombinations = [];
    for (let i = 0; i < availableFoods.length; i++) {
      for (let j = i + 1; j < availableFoods.length; j++) {
        mealCombinations.push([availableFoods[i], availableFoods[j]]);
        for (let k = j + 1; k < availableFoods.length; k++) {
          mealCombinations.push([availableFoods[i], availableFoods[j], availableFoods[k]]);
        }
      }
    }

    // 4. Filter, score, and rank the combinations
    const recommendedMeals = mealCombinations
      .map(combination => {
        const totalNutrition = combination.reduce((totals, food) => {
          totals.calories += food.calories;
          totals.protein += food.protein;
          totals.carbs += food.carbs;
          totals.fat += food.fat;
          return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return { meal: combination.map(f => f.name), nutrition: totalNutrition };
      })
      .filter(meal => {
        const { calories } = meal.nutrition;
        const { targetCalories } = nutritionalGoals;
        return calories >= targetCalories * 0.85 && calories <= targetCalories * 1.15;
      })
      .map(meal => {
        const score = Math.abs(meal.nutrition.calories - nutritionalGoals.targetCalories);
        return { ...meal, score };
      })
      .sort((a, b) => a.score - b.score);

    // 5. Return the top 5 recommendations
    res.status(200).json({
      success: true,
      count: recommendedMeals.slice(0, 5).length,
      data: recommendedMeals.slice(0, 5),
    });

  } catch (error) {
    console.error('Recommendation Error:', error);
    next(error); // Pass error to an error handling middleware
  }
};


/**
 * Helper function to define nutritional goals per meal type
 * @param {'breakfast' | 'lunch' | 'dinner'} mealType
 */
function getNutritionalGoals(mealType) {
  switch (mealType) {
    case 'breakfast':
      return { targetCalories: 400, minProtein: 15 };
    case 'lunch':
      return { targetCalories: 700, minProtein: 25 };
    case 'dinner':
      return { targetCalories: 600, minProtein: 20 };
    default:
      return { targetCalories: 600, minProtein: 20 };
  }
}
