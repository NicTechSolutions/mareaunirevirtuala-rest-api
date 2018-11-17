const express = require('express');
const router = express.Router();
const userService = require('./user.service');
const joi = require("joi");

function login(req, res, next) {
    userService.auth(req.body)
        .then((user) => user ? res.json(user) : res.status(400).json({
            message: 'Email or password is incorrect'
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

function remove(req, res, next) {
    userService.remove(req.user.sub)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function gdpr(req, res, next) {
    const reqSchema = joi.object().keys({
        "all": joi.boolean().truthy(1).falsy(0),
        // "next": joi.boolean().truthy(1).falsy(0),
        "next": joi.boolean().truthy("yes").falsy(0),
        "marketing": joi.boolean().truthy(1).falsy(0),
    });

    reqSchema.validate(req.body)
        .then((v) => {
            console.log("v" + v);
        }).catch((err) => next(err));


    userService.storeCompliance(req.user.sub, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

// routes
router.post("/login", login);
router.post("/register", register);
router.post("/fb/login", fbLogin);
router.delete("/", remove);
router.put("/gdpr", gdpr);

module.exports = router;