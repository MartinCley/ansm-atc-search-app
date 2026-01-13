const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://cleyrop.ansm-secnum.cleyrop.net/data-serve/api/v1',
      changeOrigin: true,
      pathRewrite: {
        '^/api': '', // remove /api from the path
      },
      onProxyReq: (proxyReq, req, res) => {
        // Add the Token header
        proxyReq.setHeader('Token', 'black_cake_348230');
        proxyReq.setHeader('accept', '*/*');
      },
      logLevel: 'debug'
    })
  );
};
