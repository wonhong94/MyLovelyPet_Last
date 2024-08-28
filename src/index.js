// 파일 위치: src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import AppWithRouter from './App';
import { AuthProvider } from './context/AuthContext'; // AuthProvider 가져오기

// React 애플리케이션 초기화
const container = document.getElementById('root');
const root = createRoot(container);

root.render(

    <AuthProvider>
      <AppWithRouter />
    </AuthProvider>

);
