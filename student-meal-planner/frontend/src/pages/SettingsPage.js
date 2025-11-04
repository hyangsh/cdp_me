import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Helper to format the date for the storage key
const getStorageKey = (date) => {
  const d = new Date(date);
  const year = d.getFullYear();
  const month = (`0${d.getMonth() + 1}`).slice(-2);
  const day = (`0${d.getDate()}`).slice(-2);
  return `dailySelections-${year}-${month}-${day}`;
};

const SettingsPage = () => {
  const [mealLogs, setMealLogs] = useState([]);
  const [preferences, setPreferences] = useState({
    targetCalories: 0,
    targetProtein: 0,
    targetFat: 0,
    targetSodium: 0,
  });

  useEffect(() => {
    const fetchMealLogs = async () => {
      try {
        const response = await axios.get('/api/log/all');
        setMealLogs(response.data.data);
      } catch (error) {
        console.error('Error fetching meal logs:', error);
      }
    };

    const fetchPreferences = async () => {
      try {
        const response = await axios.get('/api/preferences');
        setPreferences(response.data.data);
      } catch (error) {
        console.error('Error fetching preferences:', error);
      }
    };

    fetchMealLogs();
    fetchPreferences();
  }, []);

  const handleCancelLog = async (logId) => {
    try {
      const deletedLog = mealLogs.find(log => log._id === logId);
      if (!deletedLog) return;

      await axios.delete(`/api/log/${logId}`);
      setMealLogs(mealLogs.filter((log) => log._id !== logId));

      // Remove from localStorage
      const storageKey = getStorageKey(new Date(deletedLog.logDate));
      const savedSelections = localStorage.getItem(storageKey);
      if (savedSelections) {
        const selections = JSON.parse(savedSelections);
        selections[deletedLog.mealType] = []; // Clear the selection for that meal type
        localStorage.setItem(storageKey, JSON.stringify(selections));
      }
    } catch (error) {
      console.error('Error canceling meal log:', error);
    }
  };

  const handlePreferencesChange = (e) => {
    setPreferences({
      ...preferences,
      [e.target.name]: e.target.value,
    });
  };

  const handleSavePreferences = async () => {
    try {
      await axios.put('/api/preferences', preferences);
      alert('목표가 저장되었습니다.');
    } catch (error) {
      console.error('Error saving preferences:', error);
      alert('목표 저장에 실패했습니다.');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold mb-4">내 목표 설정</h1>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">목표 칼로리 (kcal)</label>
            <input
              type="number"
              name="targetCalories"
              value={preferences.targetCalories}
              onChange={handlePreferencesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">목표 단백질 (g)</label>
            <input
              type="number"
              name="targetProtein"
              value={preferences.targetProtein}
              onChange={handlePreferencesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">목표 지방 (g)</label>
            <input
              type="number"
              name="targetFat"
              value={preferences.targetFat}
              onChange={handlePreferencesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">목표 나트륨 (mg)</label>
            <input
              type="number"
              name="targetSodium"
              value={preferences.targetSodium}
              onChange={handlePreferencesChange}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
          <button
            onClick={handleSavePreferences}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg"
          >
            저장
          </button>
        </div>
      </div>

      <div>
        <h1 className="text-2xl font-bold mb-4">내 식사 기록</h1>
        <div className="space-y-4">
          {mealLogs.map((log) => (
            <div key={log._id} className="p-4 border rounded-lg flex justify-between items-center">
              <div>
                <p className="font-semibold">
                  {new Date(log.logDate).toLocaleDateString()} {log.mealType}
                </p>
                <p className="text-sm text-gray-600">
                  {log.foods.map(food => food.foodItem.name).join(', ')}
                </p>
              </div>
              <button
                onClick={() => handleCancelLog(log._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-lg"
              >
                기록 취소
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
