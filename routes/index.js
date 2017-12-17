const express = require('express');
const router = express.Router();
const passport = require('passport');
const AuthController = require('../controller/AuthController');
const uuidv4 = require('uuid/v4');

/* GET home page. */
router.get('/', function(request, response, next) {
  response.render("home", {title: 'Checkers667'});
});

/* GET Lobby page. */
router.get('/lobby', AuthController.isAuthenticated, function(request, response, next) {
  let chatChannelID = uuidv4();
  let moveChannelID =  uuidv4();

  response.render("lobby", {title: 'Lobby', user: request.user, chatChannel: chatChannelID, moveChannel: moveChannelID});
});

/* GET Dashboard page. */
router.get('/dashboard', AuthController.isAuthenticated, function(request, response, next) {
  response.render("dashboard", {title: 'Dashboard', user: request.user});
});

/* GET Rules page. */
router.get('/rules', AuthController.isAuthenticated, function(request, response, next) {
  response.render("rules", {title: 'Rules', user: request.user});
});

/* GET Sign Up page. */
router.get('/register', function(request, response, next) {
  response.render("register", {title: 'Registration'});
});

/* POST Sign In page. */
router.post('/lobby', AuthController.login);

/* POST Register page. */
router.post('/register', AuthController.create);

/* GET Logout page. */
router.get('/logout', AuthController.logout);


module.exports = router;
