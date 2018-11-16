const mailHelper = require('../helpers/mail');

module.exports = {
    sendRandomEmail
};

async function sendRandomEmail() {
    let body = {
        from: '"Fred Foo 👻" <foo@example.com>', // sender address
        to: 'bar@example.com, baz@example.com', // list of receivers
        subject: 'Hello ✔', // Subject line
        text: 'Hello world?', // plain text body
        html: '<b>Hello world?</b>' // html body

    };
    mailHelper.sendEmail(body);
}
