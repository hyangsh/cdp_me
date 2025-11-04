const FoodItem = require('../models/FoodItem');

// Static lookup table for specific food items
const NUTRITIONAL_DATA_LOOKUP = {
  '파': { calories: 20, protein: 1, carbs: 4, fat: 0.2, sodium: 10 },
  '라면': { calories: 500, protein: 10, carbs: 70, fat: 20, sodium: 1800 },
  '계란': { calories: 78, protein: 6, carbs: 0.6, fat: 5, sodium: 142 },
  '만두': { calories: 250, protein: 10, carbs: 30, fat: 10, sodium: 329 },
  '피자': { calories: 300, protein: 12, carbs: 35, fat: 15, sodium: 600 },
  '파스타': { calories: 350, protein: 12, carbs: 50, fat: 10, sodium: 500 },
  '닭가슴살': { calories: 165, protein: 31, carbs: 0, fat: 3.6, sodium: 50 },
  '김치': { calories: 15, protein: 1, carbs: 3, fat: 0.5, sodium: 650 },
  '햇반': { calories: 315, protein: 5, carbs: 70, fat: 1.5, sodium: 10 },
  '소고기': { calories: 250, protein: 22, carbs: 0, fat: 14, sodium: 116 },
};

// @desc    Get or Create FoodItem
// @route   POST /api/fooditems
// @access  Private (should be protected by auth middleware)
exports.getOrCreateFoodItem = async (req, res, next) => {
  try {
    const { name, calories, protein, carbs, fat, sodium } = req.body;

    let foodItem = await FoodItem.findOne({ name: name.trim() });

    if (foodItem) {
      // If FoodItem exists, return it
      return res.status(200).json({ success: true, data: foodItem });
    } else {
      // If FoodItem does not exist, create a new one
      foodItem = await FoodItem.create({
        name: name.trim(),
        calories: calories || 0,
        protein: protein || 0,
        carbs: carbs || 0,
        fat: fat || 0,
        sodium: sodium || 0,
      });
      return res.status(201).json({ success: true, data: foodItem });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch nutritional data from external API and create FoodItem
// @route   POST /api/fooditems/fetch
// @access  Private (should be protected by auth middleware)
exports.fetchAndCreateFoodItem = async (req, res, next) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ success: false, error: 'Food item name is required' });
    }

    // Check if FoodItem already exists in our DB
    let foodItem = await FoodItem.findOne({ name: name.trim() });
    if (foodItem) {
      return res.status(200).json({ success: true, data: foodItem, message: 'FoodItem already exists' });
    }

    // Use static lookup data for specific items
    const predefinedData = NUTRITIONAL_DATA_LOOKUP[name.trim()];

    let nutritionalData;
    if (predefinedData) {
      nutritionalData = predefinedData;
    } else {
      // For other items, use default values or a generic mock
      nutritionalData = {
        calories: 100, protein: 5, carbs: 15, fat: 3, sodium: 100 // Generic defaults
      };
    }

    // Create new FoodItem with fetched/default data
    foodItem = await FoodItem.create({
      name: name.trim(),
      calories: nutritionalData.calories,
      protein: nutritionalData.protein,
      carbs: nutritionalData.carbs,
      fat: nutritionalData.fat,
      sodium: nutritionalData.sodium,
    });

    res.status(201).json({ success: true, data: foodItem });
  } catch (error) {
    console.error('Error fetching and creating food item:', error);
    next(error);
  }
};

// @desc    Update existing FoodItems with nutritional data from lookup table
// @route   GET /api/fooditems/update-nutritional-data
// @access  Private (temporary route for data migration/correction)
exports.updateFoodItemNutritionalData = async (req, res, next) => {
  try {
    const updates = [];
    for (const name in NUTRITIONAL_DATA_LOOKUP) {
      const data = NUTRITIONAL_DATA_LOOKUP[name];
      const foodItem = await FoodItem.findOneAndUpdate(
        { name: name },
        { $set: data },
        { new: true, upsert: true } // upsert: true creates the document if it does not exist
      );
      if (foodItem) {
        updates.push({ name: foodItem.name, status: 'updated', data: foodItem });
      } else {
        // This part will likely not be reached with upsert:true, but is kept for safety
        updates.push({ name: name, status: 'not found', message: 'FoodItem could not be updated or created.' });
      }
    }
    res.status(200).json({ success: true, message: 'Nutritional data update process completed.', updates });
  } catch (error) {
    console.error('Error updating nutritional data:', error);
    next(error);
  }
};
