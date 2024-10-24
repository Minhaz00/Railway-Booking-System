const proxyService = require('../services/proxyService');
const dotenv = require('dotenv');
dotenv.config();

// Log if the URLs are not set
if (!process.env.USER_SERVICE_URL) {
    console.error('USER_SERVICE_URL is not defined in .env');
}

if (!process.env.TRAIN_SERVICE_URL) {
    console.error('TRAIN_SERVICE_URL is not defined in .env');
}

// Proxy requests to Service 1 using environment variable
const proxyToService1 = proxyService(process.env.USER_SERVICE_URL);

// Proxy requests to Service 2 using environment variable
const proxyToService2 = proxyService(process.env.TRAIN_SERVICE_URL);

module.exports = {
    proxyToService1,
    proxyToService2
};
