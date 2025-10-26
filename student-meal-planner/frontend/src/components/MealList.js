import React, { useState } from 'react';

const MealList = () => {
  const [recommendations, setRecommendations] = useState({
    breakfast: [],
    lunch: [],
    dinner: [],
  });
  const [selectedMeals, setSelectedMeals] = useState({
    breakfast: null,
    lunch: null,
    dinner: null,
  });

  // 목업 재고 (실제로는 API에서 가져옴)
  const mockInventory = ['햇반', '김치', '시리얼', '계란', '제육볶음', '밥', '샌드위치', '우유', '닭가슴살', '파스타'];

  const checkAvailability = (meal) => {
    const ingredients = meal.split(' + ').map(item => item.trim());
    return ingredients.every(ing => mockInventory.includes(ing));
  };

  const getRecommendations = async (mealType) => {
    // 실제 API 호출: GET /api/recommend/:mealType
    // 여기서는 목업 데이터를 사용합니다.
    const allMockRecommendations = {
      breakfast: ['햇반 + 김치', '시리얼 + 계란', '빵 + 우유'],
      lunch: ['제육볶음 + 밥', '샌드위치 + 우유', '라면 + 김치'],
      dinner: ['닭가슴살 샐러드', '파스타', '스테이크 + 밥'],
    };

    const filteredRecommendations = allMockRecommendations[mealType].filter(checkAvailability);

    setRecommendations((prev) => ({
      ...prev,
      [mealType]: filteredRecommendations,
    }));
  };

  const selectMeal = async (mealType, meal) => {
    // 실제 API 호출: POST /api/log (재고 차감 로직 포함)
    alert(`${mealType}에 ${meal}을(를) 선택했습니다.`);
    setSelectedMeals((prev) => ({
      ...prev,
      [mealType]: meal,
    }));
    // 선택 후 추천 목록 초기화
    setRecommendations((prev) => ({
      ...prev,
      [mealType]: [],
    }));
  };

  const mealTypes = [
    { id: 'breakfast', name: '아침' },
    { id: 'lunch', name: '점심' },
    { id: 'dinner', name: '저녁' },
  ];

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">식단 추천</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {mealTypes.map((mealType) => (
          <div key={mealType.id} className="bg-white rounded-lg shadow-md p-4">
            <h3 className="text-xl font-semibold mb-3">{mealType.name}</h3>
            {selectedMeals[mealType.id] ? (
              <div className="mb-4 p-2 bg-green-100 rounded-md text-green-800 font-medium">
                선택된 식단: {selectedMeals[mealType.id]}
              </div>
            ) : (
              <button
                onClick={() => getRecommendations(mealType.id)}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors mb-4"
              >
                식단 추천받기
              </button>
            )}

            {recommendations[mealType.id].length > 0 && (
              <div className="mt-4">
                <h4 className="font-medium mb-2">추천 조합:</h4>
                <ul className="space-y-2">
                  {recommendations[mealType.id].map((meal, index) => (
                    <li key={index} className="flex justify-between items-center bg-gray-100 p-2 rounded-md">
                      <span>{meal}</span>
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
        ))}
      </div>
    </div>
  );
};

export default MealList;