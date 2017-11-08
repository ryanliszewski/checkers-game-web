const express = require('express');
const router = express.Router();
const passport = require('passport');
const signUpController = require('../controller/signUpController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home", {title: 'Checkers667'});
});

/* GET Lobby page. */
router.get('/lobby', function(req, res, next) {
  res.render("lobby", {title: 'Lobby'});
});

/* GET Sign Up page. */
router.get('/register', function(req, res, next) {
  res.render("register", {title: 'Registration'});
});

/* POST Sign Up page. */
router.post('/', 
	passport.authenticate('local', { successRedirect: '/lobby',
                                   failureRedirect: '/register'
                               	})
);
/* POST Register page. */
router.post('/register', signUpController.create);



module.exports = router;
