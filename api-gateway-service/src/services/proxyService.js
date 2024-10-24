// src/services/proxyService.js
const proxy = require('express-http-proxy');

// Function to create a proxy middleware for a service
const createProxyService = (serviceUrl) => {
    return proxy(serviceUrl, {
        // Optional: Additional configuration can go here
        proxyReqPathResolver: (req) => {
            return req.originalUrl; // Keep the original path
        }
    });
};

module.exports = createProxyService;
