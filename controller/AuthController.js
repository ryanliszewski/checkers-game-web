const passport = require('passport');
const bcrypt = require('bcryptjs');
const models = require('../models');


module.exports.create = function (request, response) {
    let User;
    let firstName = request.body.firstName;
    let lastName = request.body.lastName;
    let email = request.body.email;
    let username = request.body.username;
    let password = request.body.password;

    request.checkBody('firstName', 'first name is required').notEmpty();
    request.checkBody('lastName', ' last Name is required').notEmpty();
    request.checkBody('email', 'email is required').notEmpty();
    request.checkBody('email', 'email is not valid').isEmail();
    request.checkBody('password', 'password length must be minimum 8 characters').isLength(8, 20);
    request.checkBody('password', 'password is required').notEmpty();
    request.checkBody('passwordMatch', 'Password do not match').equals(request.body.password);

    let errors = request.validationErrors();

    if (errors) {
        response.render('/register', {
            errors: errors
        });
    } else {
        User = new models.User({
            firstName: firstName,
            lastName: lastName,
            username: username,
            email: email,
            password: password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(User.password, salt, function (err, hash) {
                if (err) {
                    return response.send(err);
                }
                User.password = hash;
                // request.flash('success_msg', 'You are registered and now can login');
                User.save((err) => {
                    if (err) {
                        return response.send(err);
                    } else {

                    }
                });
                return response.redirect('/');
            });
        });
    }
};

module.exports.login = function (request, response, next) {
    passport.authenticate('local', {
        successRedirect: '/lobby',
        failureRedirect: '/'
        // failureFlash: true
    })(request, response, next);
};

module.exports.logout = function (request, response, next) {
    request.logout();
    // request.flash('success_msg', 'You are logged out');
    response.redirect('/');
};

module.exports.isAuthenticated = function (request, response, next) {
  if (request.isAuthenticated())
    return next();
  response.redirect('/');
}

