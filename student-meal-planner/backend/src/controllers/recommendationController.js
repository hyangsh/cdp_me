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
      console.log('DEBUG: User inventory is empty.');
      return res.status(200).json({ success: true, data: [], message: '재고가 비어있어 식단을 추천할 수 없습니다.' });
    }

    // Filter out inventory items where foodItem is null (e.g., if foodItem was deleted)
    const availableInventory = userInventory.filter(item => item.foodItem && item.quantity > 0);
    console.log('DEBUG: Available Inventory for recommendations:', availableInventory.map(item => ({ name: item.foodItem.name, quantity: item.quantity })));

    if (availableInventory.length === 0) {
      console.log('DEBUG: No available inventory after filtering.');
      return res.status(200).json({ success: true, data: [], message: '사용 가능한 재고가 없어 식단을 추천할 수 없습니다.' });
    }

    // 2. Define nutritional goals for the meal
    const nutritionalGoals = getNutritionalGoals(mealType);
    console.log('DEBUG: Nutritional Goals for '+mealType+':', nutritionalGoals);

    // 3. Generate all possible meal combinations respecting quantities
    const mealCombinations = generateCombinations(availableInventory);
    console.log('DEBUG: Total Meal Combinations generated:', mealCombinations.length);
    // console.log('DEBUG: Meal Combinations:', mealCombinations);

    // 4. Filter, score, and rank the combinations
    const mealsWithNutrition = mealCombinations
      .map(combination => {
        const totalNutrition = combination.reduce((totals, item) => {
          totals.calories += item.foodItem.calories * item.usedQuantity;
          totals.protein += item.foodItem.protein * item.usedQuantity;
          totals.carbs += item.foodItem.carbs * item.usedQuantity;
          totals.fat += item.foodItem.fat * item.usedQuantity;
          return totals;
        }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

        return { meal: combination.map(item => `${item.foodItem.name} (${item.usedQuantity}개)`), nutrition: totalNutrition, originalCombination: combination };
      });
    console.log('DEBUG: Meals with Nutrition (before filtering):', mealsWithNutrition.length);
    // console.log('DEBUG: Meals with Nutrition (before filtering):', mealsWithNutrition);

    const recommendedMeals = mealsWithNutrition
      .filter(meal => {
        const { calories, protein, carbs, fat } = meal.nutrition;
        const { targetCalories, minProtein, minCarbs, minFat } = nutritionalGoals;

        // Relaxed filtering:
        // 1. Calories must be within target range
        // 2. Protein should meet or be close to minimum
        // 3. Carbs and Fat can be more flexible
        const meetsCalorieTarget = calories >= targetCalories * 0.85 && calories <= targetCalories * 1.15;
        const meetsProteinTarget = protein >= minProtein * 0.75; // Allow up to 25% deficit for protein initially
        const meetsCarbsTarget = carbs >= minCarbs * 0.5;      // Allow up to 50% deficit for carbs
        const meetsFatTarget = fat >= minFat * 0.5;          // Allow up to 50% deficit for fat

        const filterPass = meetsCalorieTarget && meetsProteinTarget && meetsCarbsTarget && meetsFatTarget;
        if(!filterPass) {
            console.log(`DEBUG: Filtered out meal (${meal.meal.join(', ')}). Nutritional values: Cal: ${calories} (Target: ${targetCalories}), Prot: ${protein} (Min: ${minProtein}), Carbs: ${carbs} (Min: ${minCarbs}), Fat: ${fat} (Min: ${minFat})`);
        }
        return filterPass;
      })
      .map(meal => {
        const { calories, protein, carbs, fat } = meal.nutrition;
        const { targetCalories, minProtein, minCarbs, minFat } = nutritionalGoals;

        // Scoring based on how close it is to targets
        let score = Math.abs(calories - targetCalories); // Calorie deviation
        score += Math.max(0, minProtein - protein) * 10; // Penalty for low protein
        score += Math.max(0, minCarbs - carbs) * 5;    // Penalty for low carbs
        score += Math.max(0, minFat - fat) * 5;      // Penalty for low fat

        return { ...meal, score };
      })
      .sort((a, b) => a.score - b.score);

    // 5. Return the top 5 recommendations
    console.log('DEBUG: Filtered and Sorted Recommended Meals length:', recommendedMeals.length);
    console.log('DEBUG: Final Recommended Meals (top 5):', recommendedMeals.slice(0, 5));

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

  // Optimization: Limit combination size to prevent excessive generation
  const MAX_COMBINATION_ITEMS = 3;
  if (currentCombination.length >= MAX_COMBINATION_ITEMS) {
      return combinations; // Stop if combination is too large
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
      return { targetCalories: 400, minProtein: 15, minCarbs: 40, minFat: 10 };
    case 'lunch':
      return { targetCalories: 700, minProtein: 25, minCarbs: 70, minFat: 20 };
    case 'dinner':
      return { targetCalories: 600, minProtein: 20, minCarbs: 60, minFat: 15 };
    default:
      return { targetCalories: 600, minProtein: 20, minCarbs: 60, minFat: 15 };
  }
}
