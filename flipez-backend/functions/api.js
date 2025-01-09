require('dotenv').config();
const express = require('express');
const serverless = require("serverless-http");
const bodyParser = require('body-parser');
const cors = require('cors');
const compression = require('compression');
const requestIp = require('request-ip');
const helmet = require('helmet');
const mongoose = require('../src/lib/mongoose');

const app = express();

// Increase the request size limit
//app.use(express.json({ limit: '50mb' })); // Adjust the size as needed
//app.use(express.urlencoded({ limit: '50mb', extended: true }));

process.on('uncaughtException', async(err) => {
  console.log('=======uncaughtException=========',err)
})

app.use(express.static('upload'))

app.use(helmet());

mongoose.connect();

app.use(compression({
  level: 6,
}));
// const corsOptions = {
//   origin: '*',
//   credentials: false,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
//   allowedHeaders: ['Content-Type', 'Authorization'],
// };

// app.use(cors(corsOptions));

app.use((req, res, next) => {
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin); // Set to request's origin
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false'); // Explicitly disallow credentials
  next();
});

// Handle preflight (OPTIONS) requests
app.options('*', (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', 'false');
  res.status(204).end();
});

app.use((req, res, next) => {
  req.headers.ip = requestIp.getClientIp(req);
  next();
});
require('../src/lib/logger/console')(app);
require('../src/lib/auth/passport');
require('../src/routes')(app);
// require('../src/lib/logger/error')(app);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});

const router = express.Router();


app.use("/.netlify/functions/api", router);
module.exports.handler = serverless(app);
