var createError = require('http-errors');
var express = require('express');
var path = require('path');
var logger = require('morgan');

const cors = require('cors');
const mongoose = require('mongoose');


var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
const productRouter = require('./routes/products');
const orderRouter = require('./routes/order');
const loginRouter = require('./routes/loginRoutes');

var app = express();

// view engine setup

app.use(cors());

app.use(logger('dev'));

//Connect To DB
mongoose.connect('mongodb://localhost/shopping-api', {useNewurlParser: true}, (err)=> {
  if(err){
    console.log(err);
    return;
  } else {
    console.log("Connecting To DB..");
  }
});

app.use(express.urlencoded({extended: true}));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'productImage')));

app.use('/', indexRouter);
app.use('/products', productRouter);
app.use('/order', orderRouter);
app.use('/users', usersRouter);
app.use('/api/v1', loginRouter);

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
  res.json({
    message:err.message
  });
});

module.exports = app;
