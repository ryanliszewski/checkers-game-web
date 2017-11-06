const express               = require('express');
const path                  = require('path');
const favicon               = require('serve-favicon');
const logger                = require('morgan');
const cookieParser          = require('cookie-parser');
const bodyParser            = require('body-parser');
const passport              = require('passport');
const LocalStrategy         = require('passport-local');
// const passportLocalMongoose = require('passport-local-mongoose');
const User                  = require('./models/user');



// Will delete these after testing out my auth with mongoose
// Will later be  integrated to Postgres. 
// TEMPORARY CODE
// const mongoose = require ('mongoose')
// mongoose.connect(mongodb://localhost/auth_demo);



if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  console.log(`${process.env.NODE_ENV}, ${process.env.DATABASE_URL}`);
}

const index = require('./routes/index');
const users = require('./routes/users');
const tests = require('./routes/tests');
const register = require('./routes/register');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(passport.initialize());
app.use(passport.session());

app.use('/', index);
app.use('/users', users);
app.use('/tests', tests);
app.use('/register', index);


//secret code to encode and decode
// app.use(require("express-session")({
//   secret: "667 final project",
//   resave: false,
//   saveUninitialized: false
// }));

// passport.serializeUser(User.serializeUser());
// passport.deserializeUser(User.deserializeUser());

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  let err = new Error('Not Found');
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
