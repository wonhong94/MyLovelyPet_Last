import React, { useRef, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AutoCapture = ({ videoStream, onCapture }) => {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (videoRef.current && videoStream) {
      videoRef.current.srcObject = videoStream;
      videoRef.current.play();
    }

    return () => {
      if (videoStream) {
        const tracks = videoStream.getTracks();
        tracks.forEach(track => track.stop());
      }
    };
  }, [videoStream]);

  useEffect(() => {
    const captureFace = async () => {
      if (videoRef.current && canvasRef.current) {
        const context = canvasRef.current.getContext('2d');
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageData = canvasRef.current.toDataURL('image/png');

        // 얼굴 이미지를 캡처한 후 전달된 onCapture 콜백 함수 호출
        if (onCapture) {
          onCapture(imageData);
        }
      }
    };

    // 페이지 로드 시 한 번만 자동 캡처
    const timer = setTimeout(captureFace, 1000); // 1초 후 자동 캡처

    return () => clearTimeout(timer);
  }, [videoStream, onCapture]);

  return (
    <>
      <video ref={videoRef} style={{ display: 'none' }}></video>
      <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
    </>
  );
};

export default AutoCapture;