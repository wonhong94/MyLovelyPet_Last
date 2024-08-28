// src/components/alarm.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './alarm.css'; // CSS 파일 추가

const Alarm = () => {
  const [noticeList, setNoticeList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAlarms = async () => {
      try {
        // 로컬 스토리지에서 userIdx 가져오기
        const userIdx = localStorage.getItem('userIdx');

        // userIdx가 존재하는지 확인
        if (!userIdx) {
          throw new Error('userIdx가 로컬 스토리지에 존재하지 않습니다.');
        }

        // userIdx를 포함한 요청 URL
        const response = await axios.get(`/petShop/notice/findAll/${userIdx}`);
        if (response.status === 200) {
          setNoticeList(response.data);
        } else {
          throw new Error('알림을 가져오는 데 실패했습니다.');
        }
      } catch (err) {
        setError('알림 데이터를 가져오는 데 실패했습니다.');
        console.error('Alarm fetch error:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAlarms();
  }, []);

  if (error) return <div>{error}</div>;

  return (
    <div className="alarm-container">
      <h2>알림 페이지</h2>
      {noticeList.length > 0 ? (
        <div className="alarm-list">
          {noticeList.map((item, index) => (
            <div key={index} className="alarm-card">
              <p className="alarm-date">{new Date(item.createdAt).toLocaleString()}</p>
              <p className="alarm-body">{item.body}</p>
            </div>
          ))}
        </div>
      ) : (
        <p>알림이 없습니다.</p>
      )}
    </div>
  );
};

export default Alarm;
