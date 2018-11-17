const express = require("express");

const forgotPasswordService = require('./forgot-pass.service');

const router = express.Router();
module.exports = router;

router.post("/test-email", test);
router.post("/forgot", sendForgotPasswordEmail);

function test(req, res, next) {
    forgotPasswordService.sendRandomEmail()
        .then(() => {
            res.json({
                message: "sent"
            })
        }).catch(err => {
            next(err);
        });
}

function sendForgotPasswordEmail(req, res, next) {
    forgotPasswordService.sendForgotPasswordEmail(req.query.email)
        .then(() => {
            res.json({
                message: `sent to ${req.query.email}`
            })
        }, err => {
            next(err);
        });

}