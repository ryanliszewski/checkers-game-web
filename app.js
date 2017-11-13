const express               = require('express');
const path                  = require('path');
const favicon               = require('serve-favicon');
const logger                = require('morgan');
const cookieParser          = require('cookie-parser');
const bodyParser            = require('body-parser');
const passport              = require('passport');
const LocalStrategy         = require('passport-local').Strategy;
const session               = require('express-session');
const expressValidator      = require('express-validator');
const User                  = require('./models/user');
const bcrypt                = require('bcryptjs');
const flash                 = require('connect-flash'); 

if(process.env.NODE_ENV === 'development') {
  require('dotenv').config();
  console.log(`${process.env.NODE_ENV}, ${process.env.DATABASE_URL}`);
}

const index = require('./routes/index');
const users = require('./routes/users');
const tests = require('./routes/tests');

// const register = require('./routes/register');

const app = express();


//Configuration- Passport initialization


app.use(express.static('public'));
app.use(session({ secret: 'CSC667', resave: false,
saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());



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



// app.use('/register', index);


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

app.use('/', index);
app.use('/users', users);
app.use('/tests', tests);
app.use('/lobby', index)
passport.use(new LocalStrategy(
  function(username, password, done) {
    User.findOne({ username: username }, function (err, user) {
      if (err) { return done(err); }
      if (!user) {
        return done(null, false, { message: 'Incorrect username.' });
      }
      if (!user.validPassword(password)) {
        return done(null, false, { message: 'Incorrect password.' });
      }
      return done(null, user);
    });
  }
));


//Sessions

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.findById(id, function(err, user) {
    done(err, user);
  });
});





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
