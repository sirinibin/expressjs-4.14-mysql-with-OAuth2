#!/usr/bin/env node
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var mysql = require('mysql');
var db = require('./config/db');


var index = require('./routes/index');
var users = require('./routes/users');

//oAuth2.0
var register = require('./routes/oauth2/register');
var authorize = require('./routes/oauth2/authorize');
var accesstoken = require('./routes/oauth2/accesstoken');
var me = require('./routes/oauth2/me');

//Employees

var employees_create = require('./routes/employees/create');


var employees_index = require('./routes/employees/index');
var employees_view = require('./routes/employees/view');
var employees_update = require('./routes/employees/update');
var employees_delete = require('./routes/employees/delete');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(function(req, res, next){
  global.connection = mysql.createConnection(db.info);
  global.connection.connect();
  next();
});


app.use('/', index);
//Oauth2
app.use('/v1/register', register);
app.use('/v1/authorize', authorize);
app.use('/v1/accesstoken', accesstoken);
app.use('/v1/me', me);

//Employees
app.use('/v1/employees', employees_create);
app.use('/v1/employees', employees_index);
app.use('/v1/employees', employees_update);
app.use('/v1/employees', employees_view);
app.use('/v1/employees', employees_delete);


app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
