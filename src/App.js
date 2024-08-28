import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useLocation, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Home from './pages/Home';
import Orders from './pages/Orders';
import OrdersHistory from './pages/OrdersHistory';
import Stock from './pages/Stock';
import Inspection from './pages/Inspection';
import InspectionHistory from './pages/InspectionHistory';
import SignUp from './pages/Signup';
import Login from './pages/Login';
import SalesPage from './pages/SalesPage';
import CCTV from './pages/cctv';
import Alarm from './components/alarm';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';
import './App.css';
import ProductManagement from './pages/ProductManagement';

import { UserProvider } from './context/UserContext';
import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import './App.css'; 
import MainPage from './Kioskpages/MainPage';
import PetPage from './Kioskpages/PetPage';
import PetHeader from './Kioskcomponents/PetHeader';
import PetFooter from './Kioskcomponents/PetFooter';
import { SuccessPage } from './Kioskpages/payment/Success';
import { CheckoutPage } from './Kioskpages/payment/CheckoutPage';
import { FailPage } from './Kioskpages/payment/Fail';
import PhoneNumberInput from './Kioskpages/PhoneNumberInput';
import Chatbot from './Kioskpages/Chatbot';

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";

const AppContent = () => {
  const location = useLocation();
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';
  const [tossPayments, setTossPayments] = useState(null);


  const isPrivateRoute = [
    '/home',
    '/orders',
    '/ordershistory',
    '/stock',
    '/inspection',
    '/inspectionhistory',
    '/productmanagement',
    '/salespage',
    '/alarm',
    '/cctv'
  ].includes(location.pathname);

  const isKioskRoute = ['/kioskHome', '/petPage', '/payment', '/fail', '/phone-number-input', '/chat', '/success']
  .some(path => location.pathname.toLowerCase().startsWith(path.toLowerCase()));

  console.log('Current Path:', location.pathname); // 현재 경로 확인

  useEffect(() => {
    loadTossPayments(clientKey).then(tp => setTossPayments(tp));
  }, []);

  const showFooter = !location.pathname.includes('/success') && location.pathname !== '/kioskhome';

// isKiosk 변수를 조건에 따라 설정
let isKiosk = false; // 기본값을 false로 설정

if (isKioskRoute) {
  isKiosk = true; // isKioskRoute가 true면 true로 설정
} else if (isPrivateRoute) {
  isKiosk = false; // isPrivateRoute가 true면 false로 설정
}

  console.log(isKiosk)

  return (
    <div className={isKiosk?undefined:"layout sidebar-open"}> {/* sidebar-open을 항상 유지 */}
    {isPrivateRoute && !isAuthPage && <Header />}
    {isPrivateRoute && <Sidebar />} {/* 조건 수정 */}
    {isKioskRoute && <PetHeader />}
      <div className={isKiosk?undefined:`main-content ${isAuthPage ? 'auth-page' : ''}`}>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
          <Route path="/" element={<Login />} />
         
          {/* 보호된 경로 (로그인 필요) */}
          <Route path="/home" element={<PrivateRoute><Home /></PrivateRoute>} />
          <Route path="/orders" element={<PrivateRoute><Orders /></PrivateRoute>} />
          <Route path="/ordershistory" element={<PrivateRoute><OrdersHistory /></PrivateRoute>} />
          <Route path="/stock" element={<PrivateRoute><Stock /></PrivateRoute>} />
          <Route path="/inspection" element={<PrivateRoute><Inspection /></PrivateRoute>} />
          <Route path="/inspectionhistory" element={<PrivateRoute><InspectionHistory /></PrivateRoute>} />
          <Route path="/productmanagement" element={<PrivateRoute><ProductManagement /></PrivateRoute>} />
          <Route path="/salespage" element={<PrivateRoute><SalesPage/></PrivateRoute>} />
          <Route path="/alarm" element={<PrivateRoute><Alarm /></PrivateRoute>} />
          <Route path="/cctv" element={<PrivateRoute><CCTV /></PrivateRoute>} />

          {/* 키오스크 경로 (로그인 필요 없음) */}
          <Route path="/kioskHome" element={<MainPage />} />
          <Route path="/petPage" element={<PetPage />} />
          <Route path="/payment/checkout" element={<CheckoutPage tossPayments={tossPayments} />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/fail" element={<FailPage />} />
          <Route path="/phone-number-input" element={<PhoneNumberInput />} />
          <Route path="/chat" element={<Chatbot />} />
        </Routes>
      </div>
      {isKioskRoute && showFooter && <PetFooter />}
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <UserProvider> {/* UserProvider를 AuthProvider 내부에 추가 */}
          <AppContent />
        </UserProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;