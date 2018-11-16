const express = require("express");

const forgotPasswordService = require('./forgot-pass.service');

const router = express.Router();
module.exports = router;

router.post("/test-email", test);

function test(req, res, next) {
    forgotPasswordService.sendRandomEmail()
    .then(() => {
        res.json({
            message: "sent"
        })
    });
}