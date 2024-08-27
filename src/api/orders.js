import axios from 'axios';

// API URL 설정
const API_URL = '/api/petShop/orders/save';

// 서버에서 발주 데이터를 저장하는 함수
export const saveOrder = async (orderData) => {
  try {
    const response = await axios.post(API_URL, orderData);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 서버에서 재고 데이터를 가져오는 함수
export const getStockData = async () => {
  try {
    const response = await axios.get('/api/petShop/stock/selectAll');
    return response.data;
  } catch (error) {
    throw error;
  }
};
