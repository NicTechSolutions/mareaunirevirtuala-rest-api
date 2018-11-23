const config = require("../../config.json");
const jackrabbit = require("jackrabbit");
const winston = require("../../config/winston");
const mailHelper = require("../helpers/mail");
const rabbit = jackrabbit(config.rabbit.url);
const exchange = rabbit.default();

function sendEmail(msg, ack) {
    mailHelper.sendEmail(msg)
        .then((email) => {
            winston.info(`Reset password email sent to ${email.accepted[0]}`);
            ack();
        }).catch((err) => {
            winston.error(err);
        });
}

function work() {
    const queue = exchange.queue({
        name: config.rabbit.email,
        durable: true
    });
    queue.consume(sendEmail);
}

work();