const router = require("express").Router();
const userService = require("src/users/user.service");
const joi = require("joi");

function login(req, res, next) {
    userService.auth(req.body)
        .then((user) => user ? res.json(user) : res.status(400).json({
            message: "Email or password is incorrect"
        }))
        .catch((err) => next(err));
}

function register(req, res, next) {
    const reqSchema = joi.object().keys({
        "name": joi.string().min(3).max(30),
        "email": joi.string().email({
            minDomainAtoms: 2
        }).required(),
        "password": joi.string().regex(/^[a-zA-Z0-9#$^+=!*()@%&].{3,30}$/).required()
    });
    reqSchema.validate(req.body)
        .then((v) => {
            userService.create(req.body)
                .then((user) => user ? res.json(user) : res.status(400).json())
                .catch((err) => next(err));
        }).catch((err) => next(err));
}

function fbLogin(req, res, next) {
    const accessToken = req.body.access_token;
    userService.authFb(accessToken)
        .then((user) => res.json(user))
        .catch((err) => next(err));
}

function storeEmailPreferences(req, res, next) {
    userService.storeCompliance(req.user.sub, req.body)
        .then(() => res.json({}))
        .catch((err) => next(err));
}

function getEmailPreferences(req, res, next) {
    userService.getCompliance(req.user.sub)
        .then((pref) => res.json(pref))
        .catch((err) => next(err));
}

function counter(req, res, next) {
    userService.getDrawingsNo()
        .then((drawingsNo) => res.json(drawingsNo))
        .catch((err) => next(err));
}

// routes
router.post("/login", login);
router.post("/register", register);
router.post("/fb/login", fbLogin);
router.put("/emails", storeEmailPreferences);
router.get("/emails", getEmailPreferences);
router.get("/counter", counter);

module.exports = router;