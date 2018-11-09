var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
var apiRouter = require('./routes/word');
let bodyParser = require('body-parser');

var app = express();

app.use(bodyParser.json());
// Allows cross-origin domains to access this API
app.use((req, res, next) => {
  res.append('Access-Control-Allow-Origin' , 'http://localhost:4200');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.append("Access-Control-Allow-Headers", "Origin, Accept,Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");
  res.append('Access-Control-Allow-Credentials', true);
  next();
});



mongoose.connect('mongodb://localhost/LLA', { promiseLibrary: require('bluebird'), useNewUrlParser: true })
  .then((res)=> {
    console.log('Connection to the database sucessful');     
  })
  .catch((err) => console.log('err'));  

var apiFile = require('./routes/fileUpload');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'dist/LLA')));
app.use('/', express.static(path.join(__dirname, 'dist/LLA')));
app.use('/api', apiFile);
app.use('/api', apiRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});


module.exports = app;
console.log('module exported');