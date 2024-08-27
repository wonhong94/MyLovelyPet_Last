import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './InspectionHistory.css';

const InspectionHistory = () => {
  const [inspections, setInspections] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const fetchInspections = async (date) => {
    const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기
    const userIdx = localStorage.getItem('userIdx'); // 로컬 스토리지에서 userIdx 가져오기

    try {
      const response = await axios.get(`/api/petShop/inspection/select/${userIdx}/${date}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setInspections(response.data);
    } catch (error) {
      console.error('Error fetching inspections:', error);
    }
  };

  useEffect(() => {
    fetchInspections(selectedDate);
  }, [selectedDate]);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setSelectedDate(newDate);
    fetchInspections(newDate);
  };

  const transformData = (list) => {
    return list.map(subList => subList.map(item => {
      const pdName = item[0];
      const orderCount = item[1];
      const insCount = item[2];
      const insDetail = orderCount === insCount ? '검수완료' : '검수수량 부족';
      const orderDate = item[5];

      return {
        pdName,
        orderCount,
        insCount,
        insDetail,
        orderDate
      };
    }));
  };

  const transformedData = transformData(inspections);

  return (
    <div className="inspection-history">
      <h2>검수 내역</h2>
      <div className="date-selector">
        <label htmlFor="inspection-date">검수날짜 선택: </label>
        <input
          type="date"
          id="inspection-date"
          value={selectedDate}
          onChange={handleDateChange}
        />
      </div>
      {transformedData.length > 0 ? (
        transformedData.map((inspectionGroup, groupIndex) => (
          <div className="inspection-section" key={groupIndex}>
            <h3>발주일자: {inspectionGroup[0].orderDate}</h3>
            <table className="inspection-table">
              <thead>
                <tr>
                  <th>상품 명</th>
                  <th>발주수량</th>
                  <th>검수수량</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {inspectionGroup.map((item, index) => (
                  <tr key={index}>
                    <td>{item.pdName}</td>
                    <td>{item.orderCount}</td>
                    <td>{item.insCount}</td>
                    <td>{item.insDetail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))
      ) : (
        <p>검수 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default InspectionHistory;
