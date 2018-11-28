const sgMail = require("@sendgrid/mail");
const apiKey = require("../../config.json").sendGridApiKey;

sgMail.setApiKey(apiKey);

async function sendEmail(msg) {
    return sgMail.send(msg)
}

module.exports = {
    sendEmail
};