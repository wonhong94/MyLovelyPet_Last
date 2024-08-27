import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import './MainPage.css';
import Swal from 'sweetalert2';
import logo from '../assets/new_image_with_white_background_with_text.png';  // 이미지 경로를 import

const MainPage = () => {
  useEffect(() => {
    const preventGoBack = (e) => {
      e.preventDefault();
      window.history.pushState(null, "", window.location.pathname);
      // alert("메인 페이지입니다. 뒤로 갈 수 없습니다.");
      Swal.fire({
        title: '메인 페이지입니다',
        text: '메인 페이지에요. 뒤로 이동할 수 없어요.',
        icon: 'error',
        confirmButtonText: '확인'
      });
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener('popstate', preventGoBack);

    return () => {
      window.removeEventListener('popstate', preventGoBack);
    };
  }, []);

  return (
    <div className="main-container">
      <div className="main-top-half">
        <img src={logo} alt="Main" className="main-image" />
      </div>
      <div className="main-bottom-half">
      <div className="kioskmain-center-text-bar">
        아래 시작하기 버튼을 눌러주세요
      </div>
        <Link to="/petPage">
          <button className="Main_button">시작하기</button>
        </Link>
      </div>

    </div>
  );
};

export default MainPage;
