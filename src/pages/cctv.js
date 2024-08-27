import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './cctv.css'; // 기존 CSS 파일 임포트

const StreamViewer = () => {
    const [streamUrl, setStreamUrl] = useState(null);
    const [motionData, setMotionData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showAlert, setShowAlert] = useState(false); // 알림 표시 여부
    const [currentTime, setCurrentTime] = useState('');
    const [isPageVisible, setIsPageVisible] = useState(!document.hidden); // 페이지 가시성 여부 초기화

    useEffect(() => {
        const handleVisibilityChange = () => {
            setIsPageVisible(!document.hidden);
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);

        const fetchStreamUrl = async () => {
            setLoading(true);
            setError(null);

            try {
                const response = await axios.get('/api/petShop/stream', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    console.log('Stream URL from response:', response.data);
                    setStreamUrl(response.data);
                } else {
                    throw new Error('응답 오류');
                }
            } catch (err) {
                setError('스트림 URL을 가져오는 데 실패했습니다.');
                console.error('Stream fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        const fetchMotionData = async () => {
            try {
                const response = await axios.get('/api/petShop/motion', {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.status === 200) {
                    console.log('Motion data from response:', response.data);
                    setMotionData(response.data);
                    if (response.data === "기절" || response.data === "화재") {
                        setShowAlert(true);
                        setTimeout(() => {
                            setShowAlert(false);
                        }, 5000); // 5초 후에 알림 숨김
                    }
                } else {
                    throw new Error('응답 오류');
                }
            } catch (err) {
                setError('모션 데이터를 가져오는 데 실패했습니다.');
                console.error('Motion fetch error:', err);
            }
        };

        fetchStreamUrl(); // 스트림 URL 한 번 가져오기

        let motionIntervalId = null;

        const startFetchingMotionData = () => {
            if (!motionIntervalId) {
                fetchMotionData(); // 처음에는 즉시 데이터 가져오기
                motionIntervalId = setInterval(fetchMotionData, 15000); // 이후 15초 간격으로 데이터 가져오기
            }
        };

        const stopFetchingMotionData = () => {
            if (motionIntervalId) {
                clearInterval(motionIntervalId);
                motionIntervalId = null;
            }
        };

        // 페이지가 활성화될 때만 데이터 가져오기
        if (isPageVisible) {
            startFetchingMotionData();
        } else {
            stopFetchingMotionData();
        }

        return () => {
            stopFetchingMotionData();
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [isPageVisible]); // 페이지 가시성 여부를 의존성으로 추가

    useEffect(() => {
        const updateTime = () => {
            const now = new Date();
            const formattedTime = now.toLocaleTimeString();
            setCurrentTime(formattedTime);
        };

        updateTime(); // 초기 시간 설정

        const timeIntervalId = setInterval(updateTime, 1000); // 시간을 1초 간격으로 업데이트

        return () => clearInterval(timeIntervalId);
    }, []); // 의존성 배열

    if (loading) return <div>로딩 중...</div>;
    if (error) return <div>{error}</div>;

    let videoStyle = 'cctv-video';
    let overlayMessage = '';

    if (showAlert && motionData === "기절") {
        videoStyle = 'cctv-video blink-border';
        overlayMessage = "🚨응급환자 발견🚨";
    } else if (showAlert && motionData === "화재") {
        videoStyle = 'cctv-video blink-border';
        overlayMessage = "🚨 화재 발생 🚨";
    }

    return (
        <div className="cctv-container">
            <div className="video-wrapper">
                {streamUrl ? (
                    <img
                        src={streamUrl}
                        alt="Live Stream"
                        className={videoStyle}
                    />
                ) : (
                    <div>스트림이 없습니다</div>
                )}
                {showAlert && overlayMessage && (
                    <div className={`motion-overlay red-text blink`}>
                        <p>{overlayMessage}</p>
                    </div>
                )}
                <div className="time-overlay">
                    <p>{currentTime}</p>
                </div>
            </div>
        </div>
    );
};

export default StreamViewer;