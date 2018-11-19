const jackrabbit = require("jackrabbit");
const config = require("config.json").rabbit;

function publish(filename) {
    const rabbit = jackrabbit(config.url);
    const exchange = rabbit.default();

    exchange.queue({
        name: config.upload,
        durable: true
    });

    exchange.publish(filename, {
        key: config.upload
    });
}

module.exports = publish;