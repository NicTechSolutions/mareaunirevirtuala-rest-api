const mailHelper = require('src/helpers/mail');
const db = require("src/helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config.json");

module.exports = {
    sendForgotPasswordEmail,
    resetPassword
};

async function resetPassword(userId, newPassword) {
    return db.User.update(
        { 'id': userId }, //condition
        { 'password': bcrypt.hashSync(newPassword, 5) }, //update
        undefined, //options
        (err, user) => {
            console.log(err);
            console.log(user);
        });
}

async function sendForgotPasswordEmail(target) {
    db.User.find({ 'email': target }, (err, user) => {
        const token = jwt.sign({
            sub: user.id
        }, config.secret);

        let body = {
            from: '"RO100" <noreply@ro100.com',
            to: target,
            subject: "Resetare parola",
            text: "Acceseaza linkul",
            html: `<b>Acceseaza linkul pentru a reseta parola <a href="www.ro100.cf/reset-pass?token=${token}">Click aici</a> </b>`
        };

        mailHelper.sendEmail(body).then(sent => {
            console.log(`Email sent to ${user.email}`);
        }, err => {
            console.log(`Error in sending email to ${user.email}`);
        });

    });

}
