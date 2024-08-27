import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // useAuth 훅 사용
import './Header.css';
import logo from '../assets/logo.png'; // 로고 이미지 경로
import alarmIcon from '../assets/alarm-icon.png'; // 새 알림 아이콘 이미지 경로

const Header = () => {
  const { auth, clearAuth } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    clearAuth();
    navigate('/login');
  };

  const handleAlarmClick = () => {
    navigate('/alarm'); // '/alarm' 페이지로 이동
  };

  return (
    <div className="header">
      <div className="header-logo">
        <Link to="/home">
          <img src={logo} alt="MY LOVELY PET Logo" className="logo-image" />
        </Link>
      </div>
      <div className="header-right">
        <img 
          src={alarmIcon} 
          alt="Alarm Icon" 
          className="alarm-icon" 
          onClick={handleAlarmClick} // 알람 아이콘 클릭 시 페이지 이동
        />
        {auth && (
          <span className="logout-text" onClick={handleLogout}>Log Out</span>
        )}
      </div>
    </div>
  );
};

export default Header;