import React, { useState, useEffect } from 'react';
import './Orders.css';
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2 임포트

const Orders = () => {
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [totalOrderQuantity, setTotalOrderQuantity] = useState(0);

  const fetchStockData = async () => {
    const token = localStorage.getItem('authToken');

    try {
      const response = await axios.get('/petShop/orders/selectStock', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setStockData(response.data);
      setOrders(response.data.flat().map(product => ({ ...product, orderCount: 0 })));
    } catch (error) {
      console.error('Failed to fetch stock data:', error.message);
      setError('데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.');
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStockData();
  }, []);

  const handleOrderQuantityChange = (id, value) => {
    setOrders(prevOrders =>
      prevOrders.map(order =>
        order.product.pdIdx === id ? { ...order, orderCount: value } : order
      )
    );
  };

  const handleOrderSubmit = async () => {
    const token = localStorage.getItem('authToken');
    const userIdx = localStorage.getItem('userIdx');
    const lastOrderDateKey = `lastOrderDate_${userIdx}`;
    const lastOrderDate = localStorage.getItem(lastOrderDateKey);
    const today = new Date().toISOString().split('T')[0];

    if (lastOrderDate === today) {
      Swal.fire({
        icon: 'warning',
        title: '주의',
        text: '하루에 한 번만 발주할 수 있습니다.',
      });
      return;
    }

    const filteredOrders = orders.filter(order => order.orderCount > 0);
    if (filteredOrders.length === 0) {
      Swal.fire({
        icon: 'warning',
        title: '주의',
        text: '발주 수량이 1 이상인 상품이 없습니다.',
      });
      return;
    }

    const totalOrderQuantity = filteredOrders.reduce((total, order) => total + order.orderCount, 0);
    setTotalOrderQuantity(totalOrderQuantity);

    const orderData = {
      orderDate: today,
      pdIdx: filteredOrders.map(order => order.product.pdIdx),
      pdName: filteredOrders.map(order => order.product.pdName),
      ctgNum2: filteredOrders.map(order => order.product.category.ctgNum2),
      stCount: filteredOrders.map(order => order.stCount),
      orderCount: filteredOrders.map(order => order.orderCount),
    };

    try {
      await axios.post('/petShop/orders/save', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      localStorage.setItem(lastOrderDateKey, today);

      // SweetAlert2 사용하여 발주 내역으로 이동 여부를 물어봄
      Swal.fire({
        title: '발주가 완료되었습니다.',
        html: `총 발주 수량: ${totalOrderQuantity}개<br>발주내역페이지로 넘어가겠습니까?`,
        icon: 'success',
        showCancelButton: true,
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = '/ordershistory';
        } else {
          window.location.href = '/home';
        }
      });

    } catch (error) {
      console.error('Error saving order:', error);
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '발주를 저장하는 중 오류가 발생했습니다.',
      });
    }
  };

  const categories = ['공통', '강아지', '고양이'];

  return (
    <div className="orders">
      <h2>발주 신청</h2>
      {categories.map((category, catIndex) => (
        <div key={catIndex} className="category-section">
          <h3>{category}</h3>
          <table className='ordertable'>
            <thead>
              <tr>
                <th>상품 명</th>
                <th>상품 카테고리</th>
                <th>보유 수량</th>
                <th>최소수량</th>
                <th>발주 수량</th>
              </tr>
            </thead>
            <tbody>
              {stockData
                .flat()
                .filter(stock => stock.product.category.ctgNum1 === category)
                .map((stock, index) => (
                  <tr key={stock.product.pdIdx || index}>
                    <td>{stock.product.pdName}</td>
                    <td>{stock.product.category.ctgNum2}</td>
                    <td>{stock.stCount}</td>
                    <td>{stock.product.pdLimit}</td>
                    <td>
                      <input
                        type="number"
                        value={orders.find(order => order.product.pdIdx === stock.product.pdIdx)?.orderCount || 0}
                        onChange={e => handleOrderQuantityChange(stock.product.pdIdx, parseInt(e.target.value, 10))}
                        min="0"
                      />
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      ))}
      <button onClick={handleOrderSubmit}>발주하기</button>
    </div>
  );
};

export default Orders;