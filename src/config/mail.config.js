const nodemailer = require('nodemailer');


module.exports = emailTransporter;

const account = {
    email: "vlwc7zedyyrqexwf@ethereal.email",
    password: "TadjRuZJY4KDrZ7nRY"
};

function emailTransporter() {
    return nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        auth: {
            user: account.email,
            pass: account.password
        }
    });
};

