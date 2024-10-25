require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");

const setupProxyRoutes = require("./config/proxy");

const app = express();
const port = 8000;



app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors()); 





// Setup Proxy Routes
setupProxyRoutes(app, process.env);



const server = app.listen(port, "0.0.0.0", () => {
  console.log(`App listening at http://localhost:${port}`);
});

const shutdown = () => {
  console.log("Received shutdown signal. Closing server...");
  server.close(() => {
    console.log("Server closed.");
    process.exit(0);
  });
};

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
