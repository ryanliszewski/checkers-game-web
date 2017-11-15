var express = require('express');
var router = express.Router();

const signupController = require('../controller/signUpController');


/* GET Sign Up page. */
router.get('/register', function(req, res, next) {
  res.render("register",{title: 'Registration'});
});

/* POST Sign Up page. */
// router.post('/register', signupController.create);


module.exports = router;
