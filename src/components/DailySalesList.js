import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './DailySalesList.css';

function DailySalesList() {
  const [dailySales, setDailySales] = useState([]);

  useEffect(() => {
    // 현재 연도와 월을 가져옵니다.
    const currentDate = new Date();
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1; // JavaScript에서 월은 0부터 시작하므로 +1을 합니다.

    // 요청 경로에 연도와 월을 포함합니다.
    const requestPath = `/petShop/revenue/monthSales/${year}/${month}`;

    axios.get(requestPath)
      .then(response => {
        // 응답에서 revenues를 추출하여 dailySales로 설정
        if (response.data && Array.isArray(response.data.revenues)) {
          setDailySales(response.data.revenues);
        } else {
          console.error('Unexpected data format:', response.data);
        }
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <div className="daily-sales">
      <h3>일일 매출</h3>
      <ul>
        {dailySales.map((sale, index) => (
          <li key={index}>
            {sale.rvDate} - {sale.rvTotalPrice.toLocaleString()}원
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DailySalesList;