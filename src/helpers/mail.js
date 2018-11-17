
const emailTransporter = require('../config/');
module.exports = {
    sendEmail
};

async function sendEmail(options) {
    return emailTransporter().sendMail(options);
}
