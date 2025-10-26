import React, { useState, useEffect } from 'react';

const NutritionGap = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNutritionRecommendations = async () => {
      try {
        // 실제 API 호출: GET /api/nutrition/recommendations
        // 여기서는 목업 데이터를 사용합니다.
        const mockData = [
          { nutrient: '단백질', items: ['닭가슴살', '두부', '계란'] },
          { nutrient: '비타민 C', items: ['오렌지', '딸기', '브로콜리'] },
        ];
        // const mockData = []; // 부족한 영양소가 없는 경우 테스트
        setRecommendations(mockData);
      } catch (err) {
        setError('영양소 추천을 불러오는 데 실패했습니다.');
        console.error('Failed to fetch nutrition recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchNutritionRecommendations();
  }, []);

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
