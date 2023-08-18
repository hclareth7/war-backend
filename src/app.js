const express = require('express');

const swaggerUi = require('swagger-ui-express')
const swaggerFile = require('../swagger_output.json')
const bodyParser = require('body-parser');
const cors = require('cors')
const cookieParser = require('cookie-parser');
const logger = require('morgan');
require('dotenv').config();
require('./db/db');
const auth = require('./middlewares/auth');
const permissionMiddleware = require('./middlewares/permissions');

//APP
const app = express();

// Routes 
const router = require('./routes/router')


//CORS
const corsOptions = {
  origin: process.env.APP_ALLOWED_ORIGINS, //this needs to be changed on production
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));


app.use(logger(process.env.APP_LOG_LEVEL));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(permissionMiddleware);


// Routes 
app.use(router)
app.use('/doc', swaggerUi.serve, swaggerUi.setup(swaggerFile));


app.use(auth.checkAuthToken);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req.url)
  res.status(404).send("404 NOT FOUND!!")
});

module.exports = app;
