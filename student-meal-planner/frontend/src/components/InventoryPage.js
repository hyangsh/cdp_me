
import React, { useState, useEffect } from 'react';

const InventoryPage = () => {
  const [inventory, setInventory] = useState([]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState(1);

  // 백엔드 API로부터 재고 목록을 가져오는 함수 (시뮬레이션)
  useEffect(() => {
    // 예시 데이터. 실제로는 fetch 등을 사용하여 API 호출
    const fetchInventory = async () => {
      // const response = await fetch('/api/inventory');
      // const data = await response.json();
      const mockData = [
        { id: 1, name: '햇반', quantity: 5 },
        { id: 2, name: '계란', quantity: 10 },
        { id: 3, name: '라면', quantity: 3 },
      ];
      setInventory(mockData);
    };
    fetchInventory();
  }, []);

  // 재료 추가 핸들러
  const handleAddItem = async (e) => {
    e.preventDefault();
    if (!newItemName.trim()) {
      alert('재료 이름을 입력해주세요.');
      return;
    }
    // 실제 API 호출: POST /api/inventory
    const newItem = {
      id: Date.now(), // 임시 ID
      name: newItemName,
      quantity: newItemQuantity,
    };
    setInventory([...inventory, newItem]);
    setNewItemName('');
    setNewItemQuantity(1);
  };

  // 수량 변경 핸들러
  const handleQuantityChange = (id, amount) => {
    // 실제 API 호출: PUT /api/inventory/:id
    setInventory(
      inventory.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(0, item.quantity + amount) }
          : item
      )
    );
  };

  // 재료 삭제 핸들러
  const handleDeleteItem = (id) => {
    // 실제 API 호출: DELETE /api/inventory/:id
    setInventory(inventory.filter((item) => item.id !== id));
  };

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
      </form>

      {/* 재고 목록 */}
      <div>
        <h2 className="text-xl mb-2">내 재고 목록</h2>
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
      </div>
    </div>
  );
};

export default InventoryPage;
