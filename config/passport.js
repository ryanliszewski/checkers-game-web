const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcryptjs');
const models = require('../models');

module.exports = function(passport) {
  passport.use(new LocalStrategy(
    function(username, password, done) {
      // Match Username
      models.User.findOne({
        where: {
          username: username
        }
      }).then(function(user, err) {
        if (err) {
          return done(null, false);
        }
        if (user === null) {
          return done(null, false, {
            message: 'No user found'
          });
        }
        // Match Password
        bcrypt.compare(password, user.password, function(err, isMatch) {
          if (err) throw err;
          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, {
              message: 'Incorrect password'
            });
          }
        });
      });
    }
  ));


  //Sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    models.User.findById(id).then(function(user) {
      console.log('deserializing user:', user.dataValues);
      done(null, user);
    }).catch(function(err) {
      if (err) {
        throw err;
      }
    });
  });
};
