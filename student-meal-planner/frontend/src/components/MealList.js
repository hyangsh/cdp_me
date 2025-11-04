import React, { useState } from 'react';

const API_BASE_URL = 'http://localhost:5000/api'; // 백엔드 API 기본 URL

const MealList = ({ onSelectCombination, dailySelections, selectedDate }) => {
  const [recommendations, setRecommendations] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });

  const getRecommendations = async (mealType) => {
    try {
      const response = await fetch(`${API_BASE_URL}/recommendations/meals?mealType=${mealType}&_=${Date.now()}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      console.log('API Response Data:', result.data); // DEBUGGING SODIUM
      setRecommendations((prev) => ({
        ...prev,
        [mealType]: result.data, // Store the full recommendation object
      }));
    } catch (error) {
      console.error('Failed to fetch meal recommendations:', error);
      alert('식단 추천을 불러오는 데 실패했습니다.');
    }
  };

  const selectMeal = async (mealType, meal) => {
    try {
      const userId = "68fce1de61c6781a57e715ab"; // Mock user ID, should come from auth context in a real app

      const response = await fetch(`${API_BASE_URL}/log`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId,
          mealType: mealType,
          foods: meal.originalCombination,
          logDate: selectedDate,
        }),
      });

      if (!response.ok) {
        const errorResult = await response.json();
        throw new Error(errorResult.details || 'Failed to log meal.');
      }

      alert(`${mealType}에 ${meal.meal.join(', ')}을(를) 먹었습니다. 재고가 차감되었습니다.`);

      // Pass the detailed combination data to the parent component
      if (onSelectCombination) {
        onSelectCombination(mealType, meal.originalCombination);
      }

      // Clear recommendations for this meal type after selection
      setRecommendations((prev) => ({
        ...prev,
        [mealType]: [],
      }));
    } catch (error) {
      console.error('Failed to log meal selection:', error);
      alert(`식사 선택 기록에 실패했습니다: ${error.message}`);
    }
  };

  const mealTypes = [
    { id: 'breakfast', name: '아침' },
    { id: 'lunch', name: '점심' },
    { id: 'dinner', name: '저녁' },
  ];

  // Helper to format the selected meal for display
  const formatSelectedMeal = (combination) => {
    if (!combination || combination.length === 0) return null;
    return combination.map(item => `${item.foodItem.name} (${item.usedQuantity}개)`).join(', ');
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">식단 추천</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealTypes.map((mealType) => {
          const selectedMealText = formatSelectedMeal(dailySelections[mealType.id]);
          return (
            <div key={mealType.id} className="bg-white rounded-lg shadow-md p-4">
              <h3 className="text-xl font-semibold mb-3">{mealType.name}</h3>
              <button
                onClick={() => getRecommendations(mealType.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
              >
                식단 추천받기
              </button>

              {selectedMealText && (
                <div className="mb-4 p-2 bg-green-100 rounded-md text-green-800 font-medium">
                  선택된 식단: {selectedMealText}
                </div>
              )}

              {recommendations[mealType.id].length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">추천 조합:</h4>
                  <ul className="space-y-2">
                    {recommendations[mealType.id].map((meal, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                        <span>{meal.meal.join(', ')}</span>
                        <button
                          onClick={() => selectMeal(mealType.id, meal)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md text-sm hover:bg-green-600 transition-colors"
                        >
                          이걸로 먹기
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
};

export default MealList;