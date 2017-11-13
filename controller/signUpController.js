const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');


module.exports.create = function (req, res) {
    let firstName = req.body.firstName;
    let lastName = req.body.lastName;
    let email = req.body.email;
    let password = req.body.password;

    req.checkBody('firstName', 'first name is required').notEmpty();
    req.checkBody('lastName', ' last Name is required').notEmpty();
    req.checkBody('email', 'email is required').notEmpty();
    req.checkBody('email', 'email is not valid').isEmail();
    req.checkBody('password', 'password length must be minimum 8 characters').isLength(8, 20);
    req.checkBody('password', 'password is required').notEmpty();
    req.checkBody('passwordMatch', 'Password do not match').equals(req.body.password);

    let errors = req.validationErrors();

    if (errors) {
        res.render('/register', {
            errors: errors
        });
    } else {
        let user = new User({
            firstName: firstName,
            lastName: lastName,
            email: email,
            password: password
        });

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(user.password, salt, function (err, hash) {
                if (err) {
                    return res.send(err);
                }
                user.password = hash;
                req.flash('success_msg', 'You are registered and now can login');
                user.save((err) => {
                    if (err) {
                        return res.send(err);
                    } else {

                    }
                });
                return res.redirect('/');
            });
        });
    }
};

module.exports.login = function(req, res, next){
    passport.authenticate('local', {
        successRedirect:'/lobby',
        failureRedirect:'/',
        failureFlash: true
    })(req, res, next);
};

module.exports.logout = function(req, res, next){
    req.session.destroy( function(err) {
        req.flash('success_msg', 'You are logged out');
        res.redirect('/');
    })
};

