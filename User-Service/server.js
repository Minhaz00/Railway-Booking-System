// server.js
const http = require('http');
const app = require('./app');
const logger = require('./config/logger');  // Import winston logger

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

server.on('error', (error) => {
  logger.error(`Server Error: ${error.message}`);
});
