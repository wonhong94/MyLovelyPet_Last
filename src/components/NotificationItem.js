import React from 'react';
import './NotificationItem.css';

const NotificationItem = ({ type, message }) => {
  return (
    <div className={`notification-item ${type}`}>
      <p>{message}</p>
      <button className="close-btn">X</button>
    </div>
  );
};

export default NotificationItem;