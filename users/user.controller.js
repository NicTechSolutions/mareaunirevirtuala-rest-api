const express = require('express');
const router = express.Router();
const userService = require('./user.service');

// routes
router.post('/login', login);
router.post('/register', register);

module.exports = router;

function login(req, res, next) {
    userService.auth(req.body)
        .then(user => user ? res.json(user) : throw 'Email or password is incorrect')
        .catch(err => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then(() => res.status(200).json({}))
        .catch(err => next(err));
}