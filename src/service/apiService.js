import axios from 'axios';

const API_URL = '/api/petShop/main'; // 프록시 경로를 사용하여 설정

export const fetchData = () => {
  return axios.get(API_URL);
};