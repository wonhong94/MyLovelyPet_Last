import React, { useRef, useEffect } from 'react';
import './FaceCapture.css'; // CSS 파일 임포트

const FaceCapture = ({ onImageCapture, startCapture, size = 'small', showCaptureButton = true }) => {
    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        startCamera(); // 컴포넌트가 마운트될 때 카메라 시작
        return () => {
            // 컴포넌트 언마운트 시 카메라 스트림 종료
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, []);

    useEffect(() => {
        if (startCapture) {
            captureImage(); // startCapture가 true일 때 자동으로 이미지 캡처
        }
    }, [startCapture]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
                videoRef.current.srcObject = stream; // 카메라 스트림을 video 요소에 연결
            }
        } catch (error) {
            console.error("카메라 접근 오류:", error);
        }
    };

    const captureImage = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = videoRef.current.videoWidth; // 캔버스 크기 설정
        canvas.height = videoRef.current.videoHeight; // 캔버스 크기 설정
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        
        canvas.toBlob(blob => {
            if (blob) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    onImageCapture(reader.result); // 부모 컴포넌트로 이미지 전달
                };
                reader.readAsDataURL(blob);
            }
        });
    };

    return (
        <div className={`face-capture-container ${size}`}>
            <video ref={videoRef} autoPlay className="video-feed" />
            
            {/* 십자 표시 */}
            <div className="crosshair">
                <div className="horizontal-line" />
                <div className="vertical-line" />
            </div>

            {showCaptureButton && (
                <button className="capture-button" onClick={captureImage}>
                    얼굴 등록
                </button>
            )}

            <canvas ref={canvasRef} style={{ display: 'none' }} />
        </div>
    );
};

export default FaceCapture;