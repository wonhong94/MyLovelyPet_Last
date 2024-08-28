import React, { useState, useEffect } from 'react';
import axios from 'axios';
import CustomCalendar from '../components/Calendar';
import './Home.css';
import '../components/HomeCalendar.css';

function Home() {
  const [date, setDate] = useState(new Date());
  const [salesData, setSalesData] = useState({}); // 일일 매출 데이터를 저장할 상태
  const [totalSales, setTotalSales] = useState(0); // 매출 총액 상태
  const [monthlySales, setMonthlySales] = useState(0); // 월 매출 상태

  // 날짜를 "YYYY-MM-DD" 형식으로 포맷하는 함수 (로컬 타임존 기준)
  const formatDateToLocal = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 1을 더함
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // 달력에 표시할 매출 데이터를 가져오는 함수
  const fetchSalesData = async (selectedYear, selectedMonth) => {
    console.log('Fetching sales data for calendar...');
    try {
      // 선택된 연도와 월을 경로에 포함하여 API 요청
      const response = await axios.get(`/petShop/revenue/monthSales/${selectedYear}/${selectedMonth}`);
      console.log('Response data for calendar:', response.data);

      // 응답 데이터에서 일일 매출 데이터 추출
      const dailySales = response.data?.dailySales;

      if (Array.isArray(dailySales)) {
        // 일일 매출 데이터를 날짜별로 매핑하여 상태에 저장
        const formattedData = {};
        let monthlyTotal = 0;
        dailySales.forEach(entry => {
          formattedData[entry.rvDate] = entry.rvTotalPrice;
          monthlyTotal += entry.rvTotalPrice; // 일일 매출을 누적하여 월 매출을 계산
        });

        setSalesData(formattedData); // 일일 매출 데이터를 상태로 설정
        setMonthlySales(monthlyTotal); // 월 매출 상태 설정
      } else {
        console.error('Unexpected data format:', response.data);
        setSalesData({}); // 데이터가 예상과 다르면 빈 객체로 설정
        setMonthlySales(0); // 월 매출을 0으로 설정
      }
    } catch (error) {
      console.error('Error fetching sales data:', error.message); // 에러 메시지 출력
      console.error('Error details:', error.response ? error.response.data : 'No additional error details available'); // 에러에 대한 추가 정보 출력
    }
  };

  // 현재 매출 총액을 가져오는 함수
  const fetchTotalSales = async () => {
    console.log('Fetching total sales...');
    try {
      // 현재 매출 총액을 가져오는 API 요청
      const response = await axios.get('/petShop/revenue/dailySales');
      console.log('Response data for total sales:', response.data);

      // 총 매출액 또는 단일 매출 데이터 추출
      const totalSum = response.data?.totalSum;
      const rvTotalPrice = response.data?.rvTotalPrice;

      if (typeof totalSum === 'number') {
        setTotalSales(totalSum); // 총 매출액을 상태로 설정
      } else if (typeof rvTotalPrice === 'number') {
        setTotalSales(rvTotalPrice); // 단일 매출 데이터를 총 매출액으로 설정
      } else {
        console.error('Unexpected data format:', response.data);
        setTotalSales(0); // 데이터가 예상과 다르면 총액을 0으로 설정
      }
    } catch (error) {
      console.error('Error fetching total sales:', error.message); // 에러 메시지 출력
      console.error('Error details:', error.response ? error.response.data : 'No additional error details available'); // 에러에 대한 추가 정보 출력
    }
  };

  useEffect(() => {
    // 선택한 연도와 월에 맞는 매출 데이터를 가져옵니다.
    const selectedYear = date.getFullYear();
    const selectedMonth = date.getMonth() + 1; // 월은 0부터 시작하므로 1을 더해줍니다.
    fetchSalesData(selectedYear, selectedMonth);
  }, [date]);

  // 달력의 각 타일에 매출 데이터를 표시하는 함수
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateString = formatDateToLocal(date); // 날짜를 "YYYY-MM-DD" 형식으로 변환
      const sales = salesData[dateString]; // 해당 날짜의 매출 데이터를 가져옴

      return (
        sales && <div className="sales">{sales.toLocaleString()}원</div>
      );
    }
    return null;
  };

  return (
    <div className="home">
      <div className="calendar-section">
        <div className="actions">
          <button className="action-btn" onClick={fetchTotalSales}>현재 매출 보기</button>
          <button className="action-btn">현재 매출 총액: {totalSales.toLocaleString()}원</button>
        </div>
        <div className="calendar">
          <CustomCalendar
            date={date}
            setDate={setDate}
            tileContent={tileContent} // 타일 콘텐츠에 매출 데이터를 표시하는 함수 전달
          />
          <div className="monthly-sales">
            월 매출: {monthlySales.toLocaleString()}원
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;