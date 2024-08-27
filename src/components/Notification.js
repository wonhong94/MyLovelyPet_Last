import React from 'react';
import NotificationItem from './NotificationItem';
import './Notification.css';

const Notification = () => {
  return (
    <div className="notification">
      <div className="notification-header">
        <button className="delete-all">모두 삭제</button>
      </div>
      <div className="notification-list">
        <NotificationItem className='stock' message="(상품명) 재고 부족, 발주 바랍니다." />
        <NotificationItem className='call' message="연락 바랍니다 010-1234-1234" />
        <NotificationItem className='store' message="매장이 너무 지저분해요." />
        <NotificationItem className='ExDate' message="(상품명)의 유통기한이 임박하였습니다. 확인해주세요." />
      </div>
    </div>
  );
};

export default Notification;