import axios from 'axios';

// API URL 설정
const API_URL = 'http://localhost:5000/api/inspections';

// 서버에 검수 데이터를 저장하는 함수
export const saveInspection = (inspection) => {
  return axios.post(API_URL, inspection);
};

// 서버에서 검수 데이터를 가져오는 함수
export const getInspections = () => {
  return axios.get(API_URL);
};
