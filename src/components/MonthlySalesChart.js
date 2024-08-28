import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import '../chart';
import './MonthlySalesChart.css';  // 수정된 CSS 파일

function MonthlySalesChart() {
  const [chartData, setChartData] = useState(null);
  const [monthlySales, setMonthlySales] = useState([]);
  const [totalSales, setTotalSales] = useState(0);
  const [year, setYear] = useState(new Date().getFullYear());

  const fetchSalesData = async (selectedYear) => {
    try {
      const response = await axios.get(`/petShop/revenue/yearSales/${selectedYear}`);
      console.log('API Response:', response.data);

      if (response.data && response.data.monthlySales && typeof response.data.monthlySales === 'object') {
        const monthlySalesData = response.data.monthlySales;
        const totalPrice = response.data.totalPrice;

        const salesArray = Array.from({ length: 12 }, (_, index) => {
          const month = index + 1;
          return {
            month: month,
            rvTotalPrice: monthlySalesData[month] || '-',
          };
        });

        const labels = salesArray.map(entry => `${entry.month}월`);
        const data = salesArray.map(entry => (entry.rvTotalPrice === '-' ? null : entry.rvTotalPrice));

        setChartData({
          labels: labels,
          datasets: [
            {
              label: `${selectedYear}년 월별 매출액`,
              data: data,
              fill: false,
              borderColor: '#4BC0C0',
              tension: 0.1,
            },
          ],
        });

        setMonthlySales(salesArray);
        setTotalSales(totalPrice);
      } else {
        console.error('Unexpected data format:', response.data);
        setChartData(null);
        setMonthlySales([]);
        setTotalSales(0);
      }
    } catch (error) {
      console.error('Error fetching data:', error.message);
      setChartData(null);
      setMonthlySales([]);
      setTotalSales(0);
    }
  };

  useEffect(() => {
    fetchSalesData(year);
  }, [year]);

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const firstGroup = monthlySales.slice(0, 4);
  const secondGroup = monthlySales.slice(4, 8);
  const thirdGroup = monthlySales.slice(8, 12);

  return (
    <div className="chart-container">
      <div className="controls">
        <select value={year} onChange={handleYearChange}>
          {Array.from(new Array(10), (v, i) => new Date().getFullYear() - i).map((year) => (
            <option key={year} value={year}>
              {year}년
            </option>
          ))}
        </select>
      </div>
      
      <div className="chart-wrapper">
        {chartData ? (
          <Line data={chartData} options={{ responsive: true, maintainAspectRatio: false }} />
        ) : (
          <p>데이터를 불러오는 중입니다...</p>
        )}
      </div>

      <table className="monthly-sales-table">
        <thead>
          <tr>
            {firstGroup.map((sale, index) => (
              <th key={index}>{`${sale.month}월`}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {firstGroup.map((sale, index) => (
              <td key={index}>
                {sale.rvTotalPrice === '-' ? '-' : 
                  (typeof sale.rvTotalPrice === 'number' ? `${sale.rvTotalPrice.toLocaleString()}원` : '데이터 없음')}
              </td>
            ))}
          </tr>
          <tr>
            {secondGroup.map((sale, index) => (
              <th key={index}>{`${sale.month}월`}</th>
            ))}
          </tr>
          <tr>
            {secondGroup.map((sale, index) => (
              <td key={index}>
                {sale.rvTotalPrice === '-' ? '-' : 
                  (typeof sale.rvTotalPrice === 'number' ? `${sale.rvTotalPrice.toLocaleString()}원` : '데이터 없음')}
              </td>
            ))}
          </tr>
          <tr>
            {thirdGroup.map((sale, index) => (
              <th key={index}>{`${sale.month}월`}</th>
            ))}
          </tr>
          <tr>
            {thirdGroup.map((sale, index) => (
              <td key={index}>
                {sale.rvTotalPrice === '-' ? '-' : 
                  (typeof sale.rvTotalPrice === 'number' ? `${sale.rvTotalPrice.toLocaleString()}원` : '데이터 없음')}
              </td>
            ))}
          </tr>
          <tr className="total-row">
            <td colSpan={12}><strong>총합: {totalSales !== null ? totalSales.toLocaleString() : '데이터 없음'}원</strong></td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

export default MonthlySalesChart;