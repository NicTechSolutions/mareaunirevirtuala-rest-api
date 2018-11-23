const emailTransporter = require('../config/');

async function sendEmail(options) {
    return emailTransporter().sendMail(options);
}

module.exports = {
    sendEmail
};
