const express = require("express");
const router = express.Router();
const userService = require("src/users/user.service");

function login(req, res, next) {
    userService.auth(req.body)
        .then((user) => user ? res.json(user) : res.status(400).json({
            message: "Email or password is incorrect"
        }))
        .catch((err) => next(err));
}

function register(req, res, next) {
    userService.create(req.body)
        .then((user) => user ? res.json(user) : res.status(400).json())
        .catch((err) => next(err));
}

function fbLogin(req, res, next) {
    const accessToken = req.body.access_token;
    userService.authFb(accessToken)
        .then((user) => res.json(user))
        .catch((err) => next(err));
}

// routes
router.post("/login", login);
router.post("/register", register);
router.post("/fb/login", fbLogin);

module.exports = router;