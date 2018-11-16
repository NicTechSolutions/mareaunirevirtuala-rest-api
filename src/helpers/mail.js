
const emailTransporter = require('../config/');
module.exports = {
    sendEmail
};

function sendEmail(options) {
    emailTransporter().sendMail(options, (error, info) => {
        if (error) {
            console.log(error);
        }
        console.log('Message sent: %s', info.messageId);
    })
}
