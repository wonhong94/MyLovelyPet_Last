import React from 'react';
import './Popup.css';

const Popup = ({ onClose, onConfirm }) => {
  return (
    <>
      <div className="overlay" />
      <div className="popup-container">
        <h2>결제가 완료되었습니다!</h2>
        <p>영수증을 문자로 받으시겠습니까?</p>
        <button className="button" onClick={onConfirm}>YES</button>
        <button className="button" onClick={onClose}>NO</button>
      </div>
    </>
  );
};

export default Popup;
