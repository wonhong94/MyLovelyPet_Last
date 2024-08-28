import React from "react";
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./Success.css";
import { IoIosHome } from "react-icons/io";
import Popup from "../../Kioskcomponents/Popup"; // 대소문자를 일치시켜 임포트
import axios from 'axios';
import Swal from 'sweetalert2';

export function SuccessPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [paymentList, setPaymentList] = useState([]);
  const [isConfirmed, setIsConfirmed] = useState(false);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(30); // 30초 타이머 상태 추가

  useEffect(() => {
    const requestData = {
      orderId: searchParams.get("orderId"),
      amount: searchParams.get("amount"),
      paymentKey: searchParams.get("paymentKey"),
      sessionId: localStorage.getItem("sessionId")
    };

    async function confirm() {
      try {
        const response = await fetch("/petShop/payment/confirm", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestData),
        });

        if (!response.ok) {
          const json = await response.json();
          navigate(`/fail?message=${json.message}&code=${json.code}`);
          return;
        }

        const json = await response.json();

        // 결제 성공 후 결제 정보를 설정합니다.
        setPaymentList(json);
        setIsConfirmed(true);
        setIsPopupOpen(true); // 결제 성공 시 팝업 열기
      } catch (error) {
        // console.error('Error during payment confirmation:', error);
        Swal.fire({
          title: '결제 실패',
          text: '결제에 실패했습니다. 다시 시도해 주세요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        navigate(`/fail?message=알 수 없는 에러가 발생했습니다.&code=500`);
      }
    }

    if (!isConfirmed) {
      confirm();
    }
  }, [navigate, searchParams, isConfirmed]);

  // 타이머 감소 효과
  useEffect(() => {
    if (!isPopupOpen && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 10000000);

      return () => clearInterval(timer);
    } else if (timeLeft === 0) {
      navigate('/kioskhome');
    }
  }, [timeLeft, isPopupOpen, navigate]);

  const handlePopupConfirm = () => {
    navigate('/phone-number-input', { state: { paymentKey: searchParams.get("paymentKey") } });
  };

  const handlePopupClose = () => {
    setIsPopupOpen(false);
  };

  const handleGoToMain = async () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      console.error(sessionId);
        try {
            await axios.delete('/petShop/cart/deleteCart', {
                params: { sessionId }
            });
            localStorage.removeItem("sessionId");
        } catch (error) { 
            console.error("Error deleting cart items:", error);
            // alert("장바구니 항목을 삭제하는 중 오류가 발생했습니다.");
            Swal.fire({
              title: '이동 실패',
              text: '메인화면으로 돌아갈 수 없어요.',
              icon: 'error',
              confirmButtonText: '확인'
            });
            return;  // 오류 발생 시 홈으로 이동하지 않음
        }
    }

    // 메인 페이지로 이동
    navigate('/kioskhome');
};

  if (!isConfirmed) {
    return (
      <div className="wrapper">
        {/* 배경 분할을 위한 요소 */}
        <div className="background">
          <div className="top-half"></div>
          <div className="bottom-half"></div>
        </div>

        <div className="status-section">
          <h2>결제 확인 중...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="wrapper">
      {/* 배경 분할을 위한 요소 */}
      <div className="background">
        <div className="top-half"></div>
        <div className="bottom-half"></div>
      </div>
      <div className="success-box_section">
                <h2>결제 성공</h2>
                <h3>결제 상세 정보</h3>
        <div className="styled-table-container">
          <table className="styled-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>가격</th>
                <th>수량</th>
              </tr>
            </thead>
            <tbody>
              {paymentList.map((detail, index) => (
                <tr key={index}>
                  <td>{detail.pdName}</td>
                  <td>{Number(detail.amount).toLocaleString()}원</td>
                  <td>{detail.pdCount}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isPopupOpen && (
          <Popup
            onClose={handlePopupClose}
            onConfirm={handlePopupConfirm} // YES 클릭 시 PhoneNumberInput으로 이동
          />
        )}

        {/* 우측 하단에 타이머 표시 */}
        {!isPopupOpen && (
          <div style={{ position: 'fixed', bottom: '20px', right: '20px', fontSize: '16px', color: '#555' }}>
            {timeLeft}초 뒤 메인 화면으로 돌아갑니다.
          </div>
        )}
      </div>
                      {/* 이동된 메인으로 버튼 */}
          <div className="home-button-container">
            <button onClick={handleGoToMain} className="home-button">
            <IoIosHome size="24px" />
          </button>
        </div>
    </div>
  );
}
