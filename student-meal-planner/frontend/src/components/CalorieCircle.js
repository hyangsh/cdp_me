import React from 'react';

/**
 * 섭취 칼로리를 원형 프로그레스 바로 보여주는 컴포넌트
 * @param {object} props
 * @param {number} props.consumed - 현재 섭취한 칼로리
 * @param {number} props.recommended - 권장 칼로리
 */
const CalorieCircle = ({ consumed = 2042, recommended = 2500 }) => {
  const radius = 50; // 원의 반지름
  const circumference = 2 * Math.PI * radius; // 원의 둘레
  
  // 섭취 비율 계산 (100%를 넘지 않도록)
  const progress = Math.min(consumed / recommended, 1);
  
  // 채워질 부분의 길이 계산
  const offset = circumference * (1 - progress);

  return (
    <div className="relative flex flex-col items-center justify-center p-6 bg-white rounded-2xl shadow-md">
      <svg width="140" height="140" viewBox="0 0 120 120" className="transform -rotate-90">
        {/* 배경 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          className="text-gray-200 stroke-current"
          fill="transparent"
        />
        {/* 진행 상태 원 */}
        <circle
          cx="60"
          cy="60"
          r={radius}
          strokeWidth="10"
          className="text-green-500 stroke-current"
          fill="transparent"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.5s ease-out' }}
        />
      </svg>
      {/* 중앙 텍스트 */}
      <div className="absolute flex flex-col items-center">
        <span className="text-4xl font-bold text-gray-800">{consumed}</span>
        <span className="text-sm text-gray-500">권장 {recommended}kcal</span>
      </div>
    </div>
  );
};

export default CalorieCircle;
