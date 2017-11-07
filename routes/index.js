var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render("home", {title: 'Checkers667'});
});

/* GET Sign Up page. */
router.get('/register', function(req, res, next) {
  res.render("register", {title: 'Registration'});
});

/* POST Sign Up page. */
router.post('/register', function(req, res, next) {
  res.send('This page will be replaced by LOBBY !');
});

module.exports = router;
