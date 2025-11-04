import React from 'react';

/**
 * 단일 영양소의 섭취량 바를 표시하는 내부 컴포넌트
 */
export const NutrientBar = ({ name, consumed, recommended, unit, colorClass }) => {
  // 섭취 비율 계산 (100%를 넘지 않도록)
  const percentage = recommended > 0 ? Math.min((consumed / recommended) * 100, 100) : 0;

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-1">
        <span className="text-base font-medium text-gray-700">{name}</span>
        <span className="text-sm text-gray-500">{consumed.toFixed(1)} / {recommended}{unit}</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className={`${colorClass} h-2.5 rounded-full`}
          style={{ width: `${percentage}%`, transition: 'width 0.5s ease-in-out' }}
        ></div>
      </div>
    </div>
  );
};

/**
 * 여러 영양소 바를 목록으로 보여주는 메인 컴포넌트
 */
const NutrientBars = ({ protein = 0, fat = 0, sodium = 0 }) => {
  // Recommended values can be adjusted or passed as props in a real app
  const nutrients = [
    { name: '단백질', consumed: protein, recommended: 50, unit: 'g', colorClass: 'bg-blue-500' },
    { name: '지방', consumed: fat, recommended: 60, unit: 'g', colorClass: 'bg-yellow-400' },
    { name: '나트륨', consumed: sodium, recommended: 2300, unit: 'mg', colorClass: 'bg-red-500' },
  ];

  return (
    <div className="p-6 bg-white rounded-2xl shadow-md space-y-5">
      {nutrients.map((nutrient) => (
        <NutrientBar key={nutrient.name} {...nutrient} />
      ))}
    </div>
  );
};

export default NutrientBars;
