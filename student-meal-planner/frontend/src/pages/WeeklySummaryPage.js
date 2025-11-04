import React, { useState, useEffect } from 'react';
import { NutrientBar } from '../components/NutrientBars'; // Import the named component

const API_BASE_URL = 'http://localhost:5000/api';

const WeeklySummaryPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE_URL}/statistics/weekly`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setStats(result.data);
      } catch (err) {
        setError('주간 통계 데이터를 불러오는 데 실패했습니다.');
        console.error('Failed to fetch weekly stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchWeeklyStats();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">주간 리포트를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-500">오류: {error}</div>;
  }

  if (!stats) {
    return <div className="p-6 text-center">데이터가 없습니다.</div>;
  }

  const nutrientData = [
    { name: '단백질', consumed: stats.totals.protein, recommended: 50 * 7, unit: 'g', colorClass: 'bg-blue-500' },
    { name: '지방', consumed: stats.totals.fat, recommended: 60 * 7, unit: 'g', colorClass: 'bg-yellow-400' },
    { name: '나트륨', consumed: stats.totals.sodium, recommended: 2300 * 7, unit: 'mg', colorClass: 'bg-red-500' },
  ];

  return (
    <div className="p-4 space-y-6 pb-24 font-sans">
      <h1 className="text-3xl font-bold text-center text-gray-800">이번주 섭취 현황</h1>
      
      {/* Total Calories */}
      <div className="p-6 bg-white rounded-2xl shadow-md text-center">
        <h2 className="text-lg font-medium text-gray-500">총 섭취 칼로리</h2>
        <p className="text-5xl font-bold text-green-600 my-2">{stats.totals.calories.toFixed(0)} <span className="text-3xl">kcal</span></p>
        <p className="text-sm text-gray-400">{stats.week.start} ~ {stats.week.end}</p>
      </div>

      {/* Nutrient Bars */}
      <div className="p-6 bg-white rounded-2xl shadow-md space-y-5">
        <h2 className="text-xl font-bold mb-3">주간 영양소 요약</h2>
        {nutrientData.map(nutrient => (
          <NutrientBar key={nutrient.name} {...nutrient} />
        ))}
      </div>

      {/* Consumed Items */}
      <div className="p-6 bg-white rounded-2xl shadow-md">
        <h2 className="text-xl font-bold mb-4">이번 주에 먹은 재료</h2>
        {stats.consumedItems.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {stats.consumedItems.map((item, index) => (
              <span key={index} className="bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-medium">
                {item}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">이번 주에 기록된 재료가 없습니다.</p>
        )}
      </div>

    </div>
  );
};

export default WeeklySummaryPage;
