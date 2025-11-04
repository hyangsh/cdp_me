import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api'; // 백엔드 API 기본 URL

const NutritionGap = ({ selectedDate }) => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!selectedDate) return;

    const fetchNutritionRecommendations = async () => {
      setLoading(true);
      setError(null);

      // Format the date to YYYY-MM-DD
      const dateString = selectedDate.toISOString().split('T')[0];

      try {
        const response = await fetch(`${API_BASE_URL}/nutrition/recommendations?date=${dateString}`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        setRecommendations(result.data);
      } catch (err) {
        setError('영양소 추천을 불러오는 데 실패했습니다.');
        console.error('Failed to fetch nutrition recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionRecommendations();
  }, [selectedDate]); // Re-run effect when selectedDate changes

  if (loading) {
    return <div className="p-4 text-center">로딩 중...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">오류: {error}</div>;
  }

  return (
    <div className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-3">💡 부족한 영양소를 채워보세요!</h2>
      {
        recommendations.length > 0 ? (
          <ul className="space-y-3">
            {recommendations.map((rec, index) => (
              <li key={index} className="bg-blue-50 p-3 rounded-md flex items-center">
                <span className="font-semibold text-blue-700 mr-2">{rec.nutrient}</span>
                <span className="text-gray-700">이(가) 부족해요! ➡️ </span>
                <span className="font-medium text-green-600 ml-1">{rec.items.join(', ')}</span>
                <span className="text-gray-700">을(를) 추천해요.</span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600 font-medium">모든 영양소가 충분해요! 👍</p>
        )
      }
    </div>
  );
};

export default NutritionGap;
