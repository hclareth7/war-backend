var createError = require('http-errors');
var express = require('express');
var cors = require('cors')
const jwt = require('jsonwebtoken');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
require('dotenv').config();
require('./db/db');
var User = require('./models/user');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

var corsOptions = {
  origin: '*', //this needs to be changed on production
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));


app.use(logger(process.env.APP_LOG_LEVEL));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(async (req, res, next) => {
  try {
    if (req.headers["x-access-token"]) {
      const accessToken = req.headers["x-access-token"];
      const { userId, exp } = await jwt.verify(accessToken, process.env.JWT_KEY);
      // Check if token has expired
      if (exp < Date.now().valueOf() / 1000) {
        return res.status(401).json({ error: "JWT token has expired, please login to obtain a new one" });
      }
      res.locals.loggedInUser = await User.findById(userId);

      next();
    } else {
      console.log("[x-access-token] header not provided")
      next();
    }
  } catch (error) {
    console.log(error)
  }
});

  app.use('/', indexRouter);
  app.use('/users', usersRouter);
  
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  console.log(req.url)
  res.status(404).send("404 NOT FOUND!!")
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send('error');
});




module.exports = app;
