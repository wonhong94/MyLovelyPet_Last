import React, { createContext, useContext, useState, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // 올바른 임포트 방식

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => localStorage.getItem('authToken'));

  useEffect(() => {
    const handleStorageChange = () => {
      setAuth(localStorage.getItem('authToken'));
    };

    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    const checkTokenExpiration = () => {
      const token = localStorage.getItem('authToken');
      if (token) {
        const decodedToken = jwtDecode(token); // 올바른 디코딩 방식
        const now = Date.now().valueOf() / 1000;
        if (decodedToken.exp < now) {
          clearAuth();
          alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
          window.location.href = '/login';
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 60000); // 1분마다 토큰 만료 여부를 확인

    return () => clearInterval(interval);
  }, []);

  const clearAuth = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userIdx');
    setAuth(null);
  };

  const value = {
    auth,
    setAuth,
    clearAuth,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};