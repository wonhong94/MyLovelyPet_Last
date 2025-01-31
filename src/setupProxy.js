// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: '/api',
      changeOrigin: true,
      pathRewrite: {
        '^/petShop': '', // /api로 시작하는 경로를 제거하고 백엔드 서버에 요청
      },
    })
  );
};