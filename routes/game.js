const express = require('express');
const router = express.Router();
const AuthController = require('../controller/AuthController');

var db = require('../db');

router.get("/", AuthController.isAuthenticated, (request, response) => {
    response.render("game", {title: 'Game', user: request.user});
});

module.exports = router;
