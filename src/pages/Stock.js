import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Stock.css';

const Stock = () => {
  const [category, setCategory] = useState('전체');
  const [productType, setProductType] = useState('전체');
  const [stockData, setStockData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchStockData() {
      setIsLoading(true);
      setError(null);

      const token = localStorage.getItem('authToken'); // 로컬 스토리지에서 토큰 가져오기

      try {
        const response = await axios.get('/petShop/stock/selectAll', {
          headers: {
            'Authorization': `Bearer ${token}` // 요청 헤더에 토큰 포함
          }
        });
        setStockData(response.data);
      } catch (error) {
        console.error('Failed to fetch stock data:', error.message);
        setError('데이터를 불러오는데 실패했습니다. 다시 시도해 주세요.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchStockData();
  }, []);

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    setProductType('전체');
  };

  const handleProductTypeChange = (e) => {
    setProductType(e.target.value);
  };

  const getProductTypeOptions = () => {
    if (category === '공통') {
      return ['전체', '급식/급수기', '미용용품', '외출용품'];
    } else if(category === '강아지' || category === '고양이') {
      return ['전체', '사료', '간식', '장난감',  '위생용품'];
    } else  {
      return ['전체', '사료', '간식', '장난감', '미용용품', '위생용품', '외출용품', '급식/급수기'];
    }
  };

  const list = stockData.filter(item => {
    const categoryMatch = category === '전체' || item.product.category.ctgNum1 === category;
    const productTypeMatch = productType === '전체' || item.product.category.ctgNum2 === productType;
    return categoryMatch && productTypeMatch;
  });

  return (
    <div className="stock-page">
      <h2>재고현황</h2>
      <div className="filter-controls">
        <select className="filter-dropdown" value={category} onChange={handleCategoryChange}>
          <option value="전체">전체 카테고리</option>
          <option value="강아지">강아지</option>
          <option value="고양이">고양이</option>
          <option value="공통">공통</option>
        </select>
        <select className="filter-dropdown" value={productType} onChange={handleProductTypeChange}>
          {getProductTypeOptions().map((type, index) => (
            <option key={index} value={type}>{type}</option>
          ))}
        </select>
      </div>
      {isLoading ? (
        <p>Loading...</p>
      ) : error ? (
        <p>{error}</p>
      ) : (
        <table className="stock-table">
          <thead>
            <tr>
              <th>상품 명</th>
              <th>카테고리</th>
              <th>상품카테고리</th>
              <th>보유 수량</th>
              <th>최소수량</th>
              <th>가격</th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>{item.product.pdName}</td>
                <td>{item.product.category.ctgNum1}</td>
                <td>{item.product.category.ctgNum2}</td>
                <td>{item.stCount}</td>
                <td>{item.product.pdLimit}</td>
                <td>{item.product.pdPrice.toLocaleString()} 원</td> {/* 가격에 쉼표 추가 */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Stock;
