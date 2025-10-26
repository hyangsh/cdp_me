const Inventory = require('../models/Inventory');
const FoodItem = require('../models/FoodItem'); // FoodItem 모델을 가져옵니다.

// @desc    Get meal recommendations
// @route   GET /api/recommendations/meals
// @access  Private
exports.getMealRecommendations = async (req, res, next) => {
  try {
    const userId = "68fce1de61c6781a57e715ab"; // User ID provided by the user.
    const { mealType = 'lunch' } = req.query;

    // 1. Fetch user's inventory with populated food item details and quantities
    const userInventory = await Inventory.find({ user: userId }).populate('foodItem');
    if (!userInventory || userInventory.length === 0) {
      return res.status(200).json({ success: true, data: [], message: '재고가 비어있어 식단을 추천할 수 없습니다.' });
    }

    // Filter out inventory items where foodItem is null (e.g., if foodItem was deleted)
    const availableInventory = userInventory.filter(item => item.foodItem && item.quantity > 0);

    if (availableInventory.length === 0) {
      return res.status(200).json({ success: true, data: [], message: '사용 가능한 재고가 없어 식단을 추천할 수 없습니다.' });
    }

    // 2. Define nutritional goals for the meal
    const nutritionalGoals = getNutritionalGoals(mealType);

    // 3. Generate all possible meal combinations respecting quantities
    const mealCombinations = generateCombinations(availableInventory);

    // 4. Filter, score, and rank the combinations
    const recommendedMeals = mealCombinations
      .map(combination => {
        const totalNutrition = combination.reduce((totals, item) => {
          totals.calories += item.foodItem.calories * item.usedQuantity;
          totals.protein += item.foodItem.protein * item.usedQuantity;
          totals.carbs += item.foodItem.carbs * item.usedQuantity;
          totals.fat += item.foodItem.fat * item.usedQuantity;
          return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return { meal: combination.map(item => `${item.foodItem.name} (${item.usedQuantity}개)`), nutrition: totalNutrition };
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
 * Recursively generates meal combinations respecting ingredient quantities.
 * @param {Array} availableInventory - Array of { foodItem: FoodItem, quantity: Number } objects.
 * @param {Array} currentCombination - Current combination being built.
 * @param {Object} currentQuantities - Object tracking used quantities for each foodItem._id.
 * @param {number} startIndex - Index to start from in availableInventory.
 * @returns {Array} - Array of valid meal combinations.
 */
function generateCombinations(availableInventory, currentCombination = [], currentQuantities = {}, startIndex = 0) {
  let combinations = [];

  // Add current combination if it's not empty (a meal must have at least one item)
  if (currentCombination.length > 0) {
    combinations.push(currentCombination);
  }

  for (let i = startIndex; i < availableInventory.length; i++) {
    const inventoryItem = availableInventory[i];
    const foodItem = inventoryItem.foodItem;
    const availableQuantity = inventoryItem.quantity;
    const usedQuantity = currentQuantities[foodItem._id] || 0;

    // Try to use 1 unit of the food item if available
    if (availableQuantity - usedQuantity >= 1) {
      const newCurrentQuantities = { ...currentQuantities };
      newCurrentQuantities[foodItem._id] = usedQuantity + 1;

      const newCombinationItem = {
        foodItem: foodItem,
        usedQuantity: usedQuantity + 1,
      };

      // Find if this foodItem is already in the currentCombination and update it, or add new
      const existingIndex = currentCombination.findIndex(item => item.foodItem._id.equals(foodItem._id));
      let nextCombination;
      if (existingIndex > -1) {
        nextCombination = [...currentCombination];
        nextCombination[existingIndex] = newCombinationItem;
      } else {
        nextCombination = [...currentCombination, newCombinationItem];
      }

      combinations = combinations.concat(
        generateCombinations(availableInventory, nextCombination, newCurrentQuantities, i)
      );
    }
  }
  return combinations;
}

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
