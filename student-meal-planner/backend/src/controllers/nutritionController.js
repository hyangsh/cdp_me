const MealLog = require('../models/MealLog');
const FoodItem = require('../models/FoodItem');
const Inventory = require('../models/Inventory');

// Mock daily nutritional goals (simplified)
const DAILY_GOALS = {
  calories: 2000,
  protein: 50,
  carbs: 250,
  fat: 60,
};

// Mock prices for cost-effectiveness calculation (in a real app, this would be dynamic)
const MOCK_PRICES = {
  '닭가슴살': 1000,
  '두부': 800,
  '계란': 500,
  '오렌지': 700,
  '딸기': 900,
  '브로콜리': 600,
  '햇반': 400,
  '라면': 300,
  '파': 200,
  '만두': 1200,
  '피자': 5000,
  '파스타': 1500,
  '김치': 700,
};

// @desc    Get nutrient gap recommendations
// @route   GET /api/nutrition/recommendations
// @access  Private
exports.getNutrientGapRecommendations = async (req, res, next) => {
  try {
    const userId = "68fce1de61c6781a57e715ab"; // Mock user ID
    const { date } = req.query;

    // 1. Determine the date range for the query
    const queryDate = date ? new Date(date) : new Date();
    queryDate.setHours(0, 0, 0, 0); // Start of the day

    const nextDay = new Date(queryDate);
    nextDay.setDate(queryDate.getDate() + 1);

    // 2. Fetch user's meal logs for the selected date
    const mealLogs = await MealLog.find({
      user: userId,
      logDate: { $gte: queryDate, $lt: nextDay },
    }).populate('foods.foodItem');

    // 3. Calculate total nutrient intake for the day
    const intake = mealLogs.reduce((acc, log) => {
      log.foods.forEach(item => {
        if (item.foodItem) { // Ensure foodItem is not null
          acc.calories += item.foodItem.calories * item.quantity;
          acc.protein += item.foodItem.protein * item.quantity;
          acc.carbs += item.foodItem.carbs * item.quantity;
          acc.fat += item.foodItem.fat * item.quantity;
        }
      });
      return acc;
    }, { calories: 0, protein: 0, carbs: 0, fat: 0 });

    // 4. Identify nutrient gaps
    const gaps = [];
    if (intake.protein < DAILY_GOALS.protein) {
      gaps.push({ nutrient: '단백질', deficit: DAILY_GOALS.protein - intake.protein, key: 'protein' });
    }
    if (intake.carbs < DAILY_GOALS.carbs) {
      gaps.push({ nutrient: '탄수화물', deficit: DAILY_GOALS.carbs - intake.carbs, key: 'carbs' });
    }
    if (intake.fat < DAILY_GOALS.fat) {
      gaps.push({ nutrient: '지방', deficit: DAILY_GOALS.fat - intake.fat, key: 'fat' });
    }

    // 5. Recommend ingredients to fill gaps
    const recommendations = [];
    if (gaps.length === 0) {
      return res.status(200).json({ success: true, data: [] });
    }

    const allFoodItems = await FoodItem.find({});

    for (const gap of gaps) {
      let bestItem = null;
      let highestNutrientValue = -1;

      for (const food of allFoodItems) {
        const nutrientValue = food[gap.key] || 0;

        if (nutrientValue > highestNutrientValue) {
          highestNutrientValue = nutrientValue;
          bestItem = food.name;
        }
      }

      if (bestItem) {
        recommendations.push({ nutrient: gap.nutrient, items: [bestItem] });
      }
    }

    res.status(200).json({ success: true, data: recommendations });
  } catch (error) {
    console.error('Nutrient Gap Recommendation Error:', error);
    next(error);
  }
};
