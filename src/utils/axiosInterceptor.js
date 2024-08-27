import axios from 'axios';
import jwtDecode from 'jwt-decode'; // 올바른 임포트 방식

const setupInterceptors = (clearAuth, navigate) => {
  axios.interceptors.request.use(
    async (config) => {
      let token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token); // jwtDecode로 변경
        const now = Date.now().valueOf() / 1000;
        if (decodedToken.exp < now) {
          clearAuth();
          alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
          navigate('/login');
          return Promise.reject('토큰 만료');
        } else {
          config.headers['Authorization'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axios.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response && error.response.status === 401) {
        clearAuth();
        alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
        navigate('/login');
      }
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
