// src/components/PrivateRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }) => {
  const { auth } = useAuth();

  if (!auth) {
    alert('로그인 후 사용해주세요');
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;
