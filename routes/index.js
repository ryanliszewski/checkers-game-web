const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controller/AuthController');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home", {title: 'Checkers667'});
});

/* GET Lobby page. */
router.get('/lobby', AuthController.isAuthenticated, function(req, res, next) {
  res.render("lobby", {title: 'Lobby'});
});

/* GET Sign Up page. */
router.get('/register', function(req, res, next) {
  res.render("register", {title: 'Registration'});
});

/* POST Sign In page. */
router.post('/lobby', AuthController.login);

/* POST Register page. */
router.post('/register', AuthController.create);



module.exports = router;
