import React from 'react';

// 각 식사 항목을 나타내는 내부 컴포넌트
const MealItem = ({ time, type, consumed, recommended, icon }) => (
  <button className="w-full text-left p-4 bg-white rounded-2xl shadow-md hover:bg-gray-50 transition-colors">
    <div className="flex items-center">
      <div className="mr-4">{icon}</div>
      <div className="flex-grow">
        <p className="text-xs text-gray-400">{time}</p>
        <p className="font-semibold text-gray-800">{type}</p>
      </div>
      <div className="text-right">
        <p className="font-bold text-gray-800">{consumed}<span className="font-normal text-gray-500">/{recommended}kcal</span></p>
      </div>
    </div>
  </button>
);

// 식사 목록 전체를 나타내는 메인 컴포넌트
const MealList = () => {
  // 예시 데이터
  const meals = [
    { time: '08:10', type: '아침', consumed: 624, recommended: 700, icon: '☀️' },
    { time: '12:30', type: '점심', consumed: 812, recommended: 900, icon: '🏙️' },
    { time: '18:50', type: '저녁', consumed: 606, recommended: 700, icon: '🌙' },
    { time: '21:00', type: '간식', consumed: 150, recommended: 200, icon: ' snacking' },
  ];

  return (
    <div className="space-y-3">
      <h2 className="text-lg font-bold text-gray-700 px-2">오늘의 식사</h2>
      {meals.map((meal) => (
        <MealItem key={meal.type} {...meal} />
      ))}
    </div>
  );
};

export default MealList;
