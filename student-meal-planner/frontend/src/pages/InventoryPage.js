
import React, { useState, useEffect } from 'react';

const API_BASE_URL = 'http://localhost:5000/api'; // 백엔드 API 기본 URL

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);
  const [foodItemDetails, setFoodItemDetails] = useState(null); // New state for food item details
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [foodItemSearchLoading, setFoodItemSearchLoading] = useState(false);

  // 백엔드 API로부터 재고 목록을 가져오는 함수
  const fetchInventory = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE_URL}/inventory`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const result = await response.json();
      setInventory(result.data.map(item => ({
        id: item._id, // Inventory ID
        foodItemId: item.foodItem._id, // FoodItem ID
        name: item.foodItem.name,
        quantity: item.quantity,
      })));
    } catch (err) {
      setError('재고 목록을 불러오는 데 실패했습니다.');
      console.error('Failed to fetch inventory:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // newItemName이 변경될 때 FoodItem 상세 정보를 가져오는 useEffect
  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (newItemName.trim()) {
        setFoodItemSearchLoading(true);
        try {
          const response = await fetch(`${API_BASE_URL}/fooditems/fetch`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name: newItemName.trim() }),
          });
          if (response.ok) {
            const result = await response.json();
            setFoodItemDetails(result.data);
          } else {
            setFoodItemDetails(null); // Clear if not found
          }
        } catch (err) {
          console.error('Error fetching food item details:', err);
          setFoodItemDetails(null);
        } finally {
          setFoodItemSearchLoading(false);
        }
      } else {
        setFoodItemDetails(null);
      }
    }, 500); // 500ms debounce

    return () => clearTimeout(delayDebounceFn);
  }, [newItemName]);

  // 재료 추가 핸들러
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      alert('재료 이름을 입력해주세요.');
      return;
    }

    try {
      // FoodItem을 검색하거나 생성합니다.
      const foodItemResponse = await fetch(`${API_BASE_URL}/fooditems/fetch`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name: newItemName.trim() }), // 이름만 보내서 검색하거나 생성
      });

      if (!foodItemResponse.ok) {
        throw new Error(`HTTP error! status: ${foodItemResponse.status}`);
      }
      const foodItemResult = await foodItemResponse.json();
      const actualFoodItemId = foodItemResult.data._id;

      const response = await fetch(`${API_BASE_URL}/inventory`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          foodItem: actualFoodItemId, // 실제 FoodItem의 _id를 사용
          quantity: newItemQuantity,
          // user ID는 백엔드에서 인증 미들웨어를 통해 가져온다고 가정
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 성공적으로 추가되면 재고 목록을 다시 불러옵니다.
      fetchInventory();
      setNewItemName('');
      setNewItemQuantity(1);
      setFoodItemDetails(null); // Clear details after adding
    } catch (err) {
      setError('재료 추가에 실패했습니다.');
      console.error('Failed to add item:', err);
    }
  };

  // 수량 변경 핸들러
  const handleQuantityChange = async (id, amount) => {
    const itemToUpdate = inventory.find(item => item.id === id);
    if (!itemToUpdate) return;

    const newQuantity = Math.max(0, itemToUpdate.quantity + amount);

    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity: newQuantity }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 성공적으로 업데이트되면 재고 목록을 다시 불러옵니다.
      fetchInventory();
    } catch (err) {
      setError('수량 변경에 실패했습니다.');
      console.error('Failed to update quantity:', err);
    }
  };

  // 재료 삭제 핸들러
  const handleDeleteItem = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/inventory/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      // 성공적으로 삭제되면 재고 목록을 다시 불러옵니다.  
      fetchInventory();
    } catch (err) {
      setError('재료 삭제에 실패했습니다.');
      console.error('Failed to delete item:', err);
    }
  };

  if (loading) {
    return <div className="container mx-auto p-4 text-center">재고를 불러오는 중...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-center text-red-500">오류: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">내 재고 관리</h1>

      {/* 재료 추가 폼 */}
      <form onSubmit={handleAddItem} className="mb-6 p-4 border rounded-lg">
        <h2 className="text-xl mb-2">새 재료 추가</h2>
        <div className="flex items-center space-x-2">
          <input
            type="text"
            value={newItemName}
            onChange={(e) => setNewItemName(e.target.value)}
            placeholder="재료 이름 검색..."
            className="flex-grow p-2 border rounded"
          />
          <input
            type="number"
            value={newItemQuantity}
            onChange={(e) => setNewItemQuantity(Number(e.target.value))}
            min="1"
            className="w-20 p-2 border rounded"
          />
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
            추가하기
          </button>
        </div>
        {foodItemSearchLoading && <p className="text-sm text-gray-500 mt-2">영양 정보 검색 중...</p>}
        {foodItemDetails && (
          <div className="mt-2 p-2 bg-blue-50 rounded-md text-sm">
            <p className="font-semibold">{foodItemDetails.name} 영양 정보:</p>
            <p>칼로리: {foodItemDetails.calories}kcal, 단백질: {foodItemDetails.protein}g, 탄수화물: {foodItemDetails.carbs}g, 지방: {foodItemDetails.fat}g</p>
          </div>
        )}
      </form>

      {/* 재고 목록 */}
      <div>
        <h2 className="text-xl mb-2">내 재고 목록</h2>
        {inventory.length === 0 ? (
          <p className="text-gray-500">현재 재고가 없습니다. 새로운 재료를 추가해보세요!</p>
        ) : (
          <ul className="space-y-2">
            {inventory.map((item) => (
              <li
                key={item.id}
                className="flex items-center justify-between p-3 bg-gray-100 rounded-lg"
              >
                <span className="font-semibold">{item.name}</span>
                <div className="flex items-center space-x-3">
                  <span className="text-gray-600">{item.quantity}개</span>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => handleQuantityChange(item.id, 1)}
                      className="bg-green-500 text-white w-8 h-8 rounded-full"
                    >
                      +
                    </button>
                    <button
                      onClick={() => handleQuantityChange(item.id, -1)}
                      className="bg-yellow-500 text-white w-8 h-8 rounded-full"
                    >
                      -
                    </button>
                  </div>
                  <button
                    onClick={() => handleDeleteItem(item.id)}
                    className="bg-red-500 text-white px-3 py-1 rounded"
                  >
                    삭제
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default InventoryPage;
