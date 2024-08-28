import React from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './PetFooter.css';
import { IoIosHome } from "react-icons/io";

const Footer = () => {
  const navigate = useNavigate();

  const handleGoBack = async () => {
    // 로컬스토리지에서 세션 ID 가져오기
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      console.log("----------------------")
      try {
        // 서버에 장바구니 항목 삭제 요청 보내기
        await axios.delete('/petShop/cart/deleteCart', {
          params: { sessionId }
        });

        localStorage.removeItem("sessionId");

        navigate('/kioskHome');
      } catch (error) {
        console.error('Error deleting cart items:', error);
        alert('장바구니 항목을 삭제하는 중 오류가 발생했습니다.');
      }
    } else {
      navigate('/kioskHome');
    }
  };

  return (
    <footer className="kiosk-footer">
      <button className="back-button" onClick={handleGoBack}>
        <IoIosHome />
      </button>
    </footer>
  );
};

export default Footer;
