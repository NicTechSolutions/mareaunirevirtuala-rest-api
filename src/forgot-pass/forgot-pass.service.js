const mailHelper = require('src/helpers/mail');
const db = require("src/helpers/db");
const jwt = require("jsonwebtoken");
const config = require("config.json");

module.exports = {
    sendRandomEmail,
    sendForgotPasswordEmail
};

async function sendRandomEmail() {
    let body = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body
    };
    return mailHelper.sendEmail(body);
}

async function sendForgotPasswordEmail(target) {
    db.User.find({ 'email': target }, (err, user) => {
        console.log(err);
        console.log(`found user ${user}`)

        const token = jwt.sign({
            sub: user.id
        }, config.secret);

        let body = {
            from: '"RO100" <noreply@ro100.com',
            to: target,
            subject: "Resetare parola",
            text: "Acceseaza linkul",
            html: `<b>Acceseaza linkul pentru a reseta parola www.ro100.cf/reset-pass?token=${token}</b>`
        };

        mailHelper.sendEmail(body).then(sent => {
            console.log("Email sent");
        }, err => {
            console.log("Error in sending email");
        });

    });

}
