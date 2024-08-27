import axios from 'axios';

// API URL 설정
const API_URL = '/api/stock';

export const getStockData = async () => {
  try {
    const response = await axios.get(API_URL);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const saveProduct = async (productData) => {
  try {
    const response = await axios.post(API_URL, productData);
    return response.data;
  } catch (error) {
    throw error;
  }
};
