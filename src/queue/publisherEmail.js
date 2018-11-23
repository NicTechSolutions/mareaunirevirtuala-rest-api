const jackrabbit = require("jackrabbit");
const config = require("config.json").rabbit;

function publish(body) {
    const rabbit = jackrabbit(config.url);
    const exchange = rabbit.default();

    exchange.queue({
        name: config.email,
        durable: true
    });

    exchange.publish(body, {
        key: config.email
    });
}

module.exports = publish;