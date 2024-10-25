// proxy.js
const proxy = require("express-http-proxy");

// Function to create a proxy middleware
const createProxy = (target) => proxy(target, {
  proxyReqOptDecorator: (proxyReqOpts, srcReq) => {
    if (srcReq.headers['content-type']) {
      proxyReqOpts.headers['Content-Type'] = srcReq.headers['content-type'];
    }
    return proxyReqOpts;
  },
  userResDecorator: (proxyRes, proxyResData) => proxyResData,
});

// Function to set up proxy routes
const setupProxyRoutes = (app, env) => {
  const routes = {
    "/train": process.env.TRAIN_API_URL,
    "/user": process.env.USER_API_URL
    
  };

  Object.keys(routes).forEach((route) => {
    app.use(route, createProxy(routes[route]));
  });
};

module.exports = setupProxyRoutes;
