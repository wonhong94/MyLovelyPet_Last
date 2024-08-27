import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2'; // SweetAlert2 임포트
import './Inspection.css';

const Inspection = () => {
  const [orders, setOrders] = useState(null); // 발주 내역 상태
  const [orderDate, setOrderDate] = useState(new Date().toISOString().split('T')[0]); // 오늘 날짜로 초기화
  const [inspections, setInspections] = useState([]); // 검수 내역 상태

  const userIdx = localStorage.getItem('userIdx'); // 로컬 스토리지에서 userIdx 가져오기

  const fetchOrders = async (orderDate) => {
    console.log(`/petShop/inspection/selectOrder/${userIdx}/${orderDate}`)
    try {
      const response = await axios.get(`/api/petShop/inspection/selectOrder/${userIdx}/${orderDate}`);
      setOrders(response.data);
    } catch (error) {
      console.error('Error fetching orders:', error);
      setOrders(null); // 에러가 발생하면 orders를 null로 설정
    }
  };

  useEffect(() => {
    fetchOrders(orderDate); // 컴포넌트가 로드될 때 및 날짜가 변경될 때 발주 내역을 가져옵니다.
  }, [orderDate]);

  const handleDateChange = (event) => {
    const newDate = event.target.value;
    setOrderDate(newDate); // 선택한 날짜를 상태에 저장합니다.
  };

  const handleInspectionChange = (itemIndex, field, value) => {
    const newInspections = inspections.map((inspect, index) =>
      index === itemIndex ? { ...inspect, [field]: value } : inspect
    );

    if (field === 'insCount') {
      const orderCount = orders.orderCount[itemIndex];
      const insCount = parseInt(value, 10);

      if (insCount === orderCount) {
        newInspections[itemIndex] = {
          ...newInspections[itemIndex],
          insDetail: '수량일치', // 예제에서 주어진 "발주" 상태
        };
      } else {
        newInspections[itemIndex] = {
          ...newInspections[itemIndex],
          insDetail: '수량 불일치', // 예제에서 주어진 "미발주" 상태
        };
      }
    }

    setInspections(newInspections); // 검수 내역 상태를 업데이트합니다.
  };

  const addInspection = (itemIndex) => {
    if (!inspections[itemIndex]) {
      const newInspection = { 
        pdIdx: orders.pdIdx[itemIndex], 
        insCount: '', 
        insExDate: '', 
        insDetail: '', 
        insDate: orderDate // 발주된 날짜로 설정
      };
      const newInspections = [...inspections];
      newInspections[itemIndex] = newInspection;
      setInspections(newInspections); // 검수 항목을 추가합니다.
    }
  };

  const prepareInspectionData = () => {
    const data = {
      insCount: inspections.map(inspection => inspection.insCount),
      insDetail: inspections.map(inspection => inspection.insDetail),
      insExDate: inspections.map(inspection => inspection.insExDate),
      insDate: orderDate // 발주된 날짜로 설정
    };
    return data; // 전송할 검수 데이터를 반환합니다.
  };

  const handleSave = () => {
    const inspectionData = prepareInspectionData(); // 데이터를 준비합니다.

    // SweetAlert2 사용하여 검수 내역으로 이동 여부를 물어봄
    Swal.fire({
      title: '검수가 완료되었습니다.',
      text: '검수내역으로 넘어가시겠습니까?',
      icon: 'success',
      showCancelButton: true,
      confirmButtonText: 'Yes',
      cancelButtonText: 'No',
    }).then((result) => {
      if (result.isConfirmed) {
        confirmSave(inspectionData); // 검수 데이터 저장 후 검수 내역 페이지로 이동
      } else {
        window.location.href = '/home'; // 홈 페이지로 이동
      }
    });
  };

  const confirmSave = async (inspectionData) => {
    try {
      const response = await axios.post(`/api/petShop/inspection/save/`, inspectionData, {
        headers: {
          'Content-Type': 'application/json', // JSON 형식으로 데이터 전송
        }
      }); // 서버로 전송
      console.log('Inspection saved:', response.data);
      window.location.href = '/inspectionhistory'; // 검수 내역 페이지로 이동
    } catch (error) {
      console.error('Error saving inspection:', error);
    }
  };

  return (
    <div className="inspection">
      <h2>검수하기</h2>
      <div className="date-selector">
        <label>발주날짜:</label>
        <input
          type="date"
          value={orderDate}
          onChange={handleDateChange} // 날짜 변경 시 핸들러 호출
        />
      </div>
      {orders ? (
        <>
          <div className="order-section">
            <table>
              <thead>
                <tr>
                  <th>상품 명</th>
                  <th>발주 수량</th>
                  <th>검수 수량</th>
                  <th>비고</th>
                </tr>
              </thead>
              <tbody>
                {orders.pdName.map((name, index) => (
                  <tr key={index}>
                    <td>{name}</td>
                    <td>{orders.orderCount[index]}</td>
                    <td>
                      <input
                        type="number"
                        value={inspections[index]?.insCount || ''}
                        onChange={e => handleInspectionChange(index, 'insCount', e.target.value)} // 검수 수량 변경 시 핸들러 호출
                        onFocus={() => addInspection(index)} // 포커스 시 검수 항목 추가
                      />
                    </td>
                    <td>
                      {inspections[index]?.insDetail || ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button className="save-button" onClick={handleSave}>저장하기</button>
        </>
      ) : (
        <p>검수 할 내역이 없습니다.</p>
      )}
    </div>
  );
};

export default Inspection;