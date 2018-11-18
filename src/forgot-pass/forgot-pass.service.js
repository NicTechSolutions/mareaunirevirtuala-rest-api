const mailHelper = require('src/helpers/mail');
const db = require("src/helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config.json");

module.exports = {
    sendForgotPasswordEmail,
    resetPassword
};

async function resetPassword(token, newPassword) {
    console.log(token + " " + newPassword)
    return db.PasswordResetToken.find({ 'token': token }, (err, resetTokens) => {
        if (!resetTokens[0]) {
            throw "Invalid reset password token";
        }
        return db.User.updateOne(
            { "email": resetTokens[0].userEmail }, //condition
            { $set: { "hash": bcrypt.hashSync(newPassword, 5) } }, //update
            (err, users) => {
                if (err) {
                    throw err;
                }
                console.log(users);
            }
            );
    })

}

async function sendForgotPasswordEmail(target) {
    return db.User.find({ 'email': target }, (err, user) => {
        if (!user) {
            throw "User not found";
        }
        const resetTokenObj = new db.PasswordResetToken({
            'userEmail': target,
            'token': genToken()
        });

        resetTokenObj.save((err, resetToken) => {
            let body = {
                from: '"RO100" <noreply@ro100.com',
                to: target,
                subject: "Resetare parola",
                text: "Acceseaza linkul",
                html: `<b>Acceseaza linkul pentru a reseta parola <a href="www.ro100.cf/reset-pass?token=${resetToken.token}">Click aici</a> </b>`
            };

            mailHelper.sendEmail(body).then(sent => {
                console.log(`Email sent`);
            }, err => {
                console.log(`Error in sending email`);
            });
        })
    });
}

var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var genToken = function () {
    return rand() + rand(); // to make it longer
};