// import { initializeApp } from 'firebase/app';
// import { getMessaging, getToken as getMessagingToken, onMessage } from 'firebase/messaging';

// const firebaseConfig = {
//     apiKey: "AIzaSyAUkr3SPh_0guAxwJoslvSWndxgHrt_ygc",
//     authDomain: "finalproject-241f9.firebaseapp.com",
//     projectId: "finalproject-241f9",
//     storageBucket: "finalproject-241f9.appspot.com",
//     messagingSenderId: "911563978217",
//     appId: "1:911563978217:web:8afd26d0536c51ab5cc778",
//     measurementId: "G-YYLQF1MGVW"
//   };
  

// const app = initializeApp(firebaseConfig);
// const messaging = getMessaging(app);

// // Service Worker 등록
// if ('serviceWorker' in navigator) {
//     navigator.serviceWorker
//         .register('/firebase-messaging-sw.js')
//         .then((registration) => {
//             console.log('Service Worker 등록 완료: ', registration);
//             messaging.useServiceWorker(registration);
//         })
//         .catch((err) => console.error('Service Worker 등록 실패: ', err));
// }

// // getToken을 내보내기 위해 직접 가져온 후, 내보냅니다.
// export { messaging, getMessagingToken as getToken, onMessage };
