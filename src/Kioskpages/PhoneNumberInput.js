import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from 'axios'; // axios import 추가
import Swal from 'sweetalert2';
import "./PhoneNumberInput.css";

function PhoneNumberInput() {
  const navigate = useNavigate();
  const location = useLocation();
  const [phoneNum, setPhoneNum] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 경고 메시지 상태 추가

  // location.state로 전달된 paymentKey를 받아옵니다.
  const paymentKey = location.state?.paymentKey || "";

  const handlePhoneNumberChange = (e) => {
    setPhoneNum(e.target.value);
    setErrorMessage(""); // 입력 시 에러 메시지 초기화
  };

  const handleSubmit = async (e) => {
    e.preventDefault();


    // 휴대폰 번호가 11자리인지 확인
    if (phoneNum.length !== 11) {
     setErrorMessage("휴대폰 번호는 11자리여야 합니다."); // 에러 메시지 설정
     return; // 제출 중단
    }
    
    try {
      console.log(phoneNum);
      console.log(paymentKey);
      const response = await fetch("/api/petShop/payment/sendPaymentList", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          phoneNum: phoneNum,
          paymentKey: paymentKey
        })
      });

      if (!response.ok) {
        const json = await response.json();
        console.error('Error response from server:', json); // 오류 응답 로그 출력
        navigate(`/fail?message=${json.message}&code=${json.code}`);
        return;
      }

      const json = await response.json();

      // 서버 응답을 콘솔에 출력합니다.
      console.log("Server response:", json);
      console.log("Phone number sent:", phoneNum);
      console.log("Payment key sent:", paymentKey);

      // 서버 응답에 따라 다른 동작을 설정할 수 있습니다.
      navigate(`/success?phoneNumber=${phoneNum}`);
      handleGoToMain(); // 장바구니 삭제 후 메인으로 이동

    } catch (error) {
      console.error('Error during phone number confirmation:', error);
      navigate(`/fail?message=알 수 없는 에러가 발생했습니다.&code=500`);
    }
  };

  const handleGoToMain = async () => {
    const sessionId = localStorage.getItem("sessionId");

    if (sessionId) {
      try {
        await axios.delete('/api/petShop/cart/deleteCart', {
          params: { sessionId }
        });
        localStorage.removeItem("sessionId");
      } catch (error) {
        console.error("Error deleting cart items:", error);
        Swal.fire({
          title: '이동 실패',
          text: '메인화면으로 돌아갈 수 없어요.',
          icon: 'error',
          confirmButtonText: '확인'
        });
        alert("장바구니 항목을 삭제하는 중 오류가 발생했습니다.");
        return;  // 오류 발생 시 홈으로 이동하지 않음
      }
    }

    // 메인 페이지로 이동
    navigate('/kioskHome');
  };

  return (
    <div className="input-container">
      {/* 배경 분할을 위한 요소 */}
      <div className="background">
        <div className="input-top-half"></div>
        <div className="input-bottom-half"></div>
      </div>

    <div className="input-center-text-box">
      <h2>휴대폰 번호 입력</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="phone-number"></label>
          <input
            type="text"
            id="phone-number"
            className="phone_inputText"
            value={phoneNum}
            onChange={handlePhoneNumberChange}
            required
            placeholder="번호를 입력하세요"
          />
        </div>
        {errorMessage && <p className="error-message">{errorMessage}</p>} {/* 경고 메시지 표시 */}
        <button type="submit">
          확인
        </button>
      </form>
      </div> 
    </div>
  );
}

export default PhoneNumberInput;
