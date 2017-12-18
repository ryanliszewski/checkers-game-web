const express = require('express');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const expressValidator = require('express-validator');
const flash = require('connect-flash');

if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  console.log(`${process.env.NODE_ENV}, ${process.env.DATABASE_URL}`);
}

const index = require('./routes/index');
const game = require('./routes/game');

// const register = require('./routes/register');

const app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');


//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(flash());




app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));


app.use(session({
  secret: 'CSC667',
  resave: false,
  saveUninitialized: false
}));

require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


app.use('/', index);
app.use('/lobby', index);
app.use('/game', game);


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
