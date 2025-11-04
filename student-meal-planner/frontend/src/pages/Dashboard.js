import React, { useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import CalorieCircle from '../components/CalorieCircle';
import NutrientBars from '../components/NutrientBars';
import MealList from '../components/MealList';
import NutritionGap from '../components/NutritionGap';

// Helper to format the date for the storage key
const getStorageKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `dailySelections-${year}-${month}-${day}`;
};

const Dashboard = () => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailySelections, setDailySelections] = useState(null); // Initialize with null
  const [totalNutrients, setTotalNutrients] = useState({ calories: 0, protein: 0, fat: 0, sodium: 0 });

  // Effect to LOAD data from localStorage when the date changes
  useEffect(() => {
    const storageKey = getStorageKey(selectedDate);
    const savedSelections = localStorage.getItem(storageKey);
    setDailySelections(savedSelections ? JSON.parse(savedSelections) : { breakfast: [], lunch: [], dinner: [] });
  }, [selectedDate]);

  // Effect to SAVE data and CALCULATE totals when selections change
  useEffect(() => {
    // Do not run on the initial null state
    if (dailySelections === null) return;

    // Save to localStorage
    const storageKey = getStorageKey(selectedDate);
    localStorage.setItem(storageKey, JSON.stringify(dailySelections));

    // Calculate totals
    let totals = { calories: 0, protein: 0, fat: 0, sodium: 0 };
    for (const mealType in dailySelections) {
      const combination = dailySelections[mealType];
      if (combination && combination.length > 0) {
        combination.forEach(item => {
          if (item.foodItem) {
            totals.calories += item.foodItem.calories || 0;
            totals.protein += item.foodItem.protein || 0;
            totals.fat += item.foodItem.fat || 0;
            totals.sodium += item.foodItem.sodium || 0;
          }
        });
      }
    }
    setTotalNutrients(totals);

  }, [dailySelections, selectedDate]);

  const handleSelectCombination = (mealType, combination) => {
    setDailySelections(prev => ({
      ...prev,
      [mealType]: combination,
    }));
  };

  // Render a loading state or null while dailySelections is being loaded
  if (dailySelections === null) {
    return <div className="p-6 text-center">로딩 중...</div>; 
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <main className="p-4 space-y-6 pb-24">
        {/* Date Picker Section */}
        <div className="flex justify-center items-center p-4 bg-white rounded-2xl shadow-md">
          <h2 className="text-lg font-semibold mr-4">날짜 선택:</h2>
          <DatePicker
            selected={selectedDate}
            onChange={(date) => setSelectedDate(date)}
            dateFormat="yyyy/MM/dd"
            className="text-center font-bold text-lg p-2 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <CalorieCircle calories={totalNutrients.calories} />
        <NutrientBars protein={totalNutrients.protein} fat={totalNutrients.fat} sodium={totalNutrients.sodium} />
        <MealList onSelectCombination={handleSelectCombination} dailySelections={dailySelections} selectedDate={selectedDate} />
        <NutritionGap selectedDate={selectedDate} />
      </main>
    </div>
  );
};

export default Dashboard;
