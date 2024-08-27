import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './OrdersHistory.css';

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // List<List<Object>> 형식의 데이터를 변환하는 함수
  const transformData = (list) => {
    return list.map(item => ({
      pdName: item[0],
      category: item[1],
      stCount: item[2],
      orderCount: item[3]
    }));
  };

  // 선택한 날짜에 맞는 발주 내역을 서버에서 가져오는 함수
  const fetchOrders = async (orderDate) => {
    setIsLoading(true);
    setError(null);

    const token = localStorage.getItem('authToken');
    const userIdx = localStorage.getItem('userIdx');
    const url = `/api/petShop/orders/select/${userIdx}/${orderDate}`;

    console.log('Fetching orders from URL:', url);
    console.log('Using token:', token);

    try {
      const response = await axios.get(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const transformedData = transformData(response.data);
      setOrders(transformedData);
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      setError('해당 날짜에 발주내역이 없습니다');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // 오늘 날짜를 기본값으로 설정
    const today = new Date().toISOString().split('T')[0];
    setSelectedDate(today);
    fetchOrders(today); // 오늘 날짜로 발주 내역을 가져옵니다.
  }, []);

  // 날짜 변경 핸들러
  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    fetchOrders(newDate);  // 날짜 변경 시 서버에 요청
  };

  return (
    <div className="orders-history">
      <h2>발주 내역</h2>
      <div className="date-filter">
        <label htmlFor="order-date">날짜:</label>
        <input
          type="date"
          id="order-date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        orders.length > 0 ? (
          <table className="orders-table">
            <thead>
              <tr>
                <th>상품 명</th>
                <th>상품 카테고리</th>
                <th>보유 수량</th>
                <th>발주 수량</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order, index) => (
                <tr key={index}>
                  <td>{order.pdName}</td>
                  <td>{order.category}</td>
                  <td>{order.stCount}</td>
                  <td>{order.orderCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>발주 내역이 없습니다.</p>
        )
      )}
    </div>
  );
};

export default OrdersHistory;
