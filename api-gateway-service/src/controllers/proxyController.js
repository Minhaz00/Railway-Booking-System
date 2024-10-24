// src/controllers/proxyController.js
const proxyService = require('../services/proxyService');

// Proxy requests to Service 1
const proxyToService1 = proxyService('http://service1:4001');

// Proxy requests to Service 2
const proxyToService2 = proxyService('http://service2:4002');

module.exports = {
    proxyToService1,
    proxyToService2
};
