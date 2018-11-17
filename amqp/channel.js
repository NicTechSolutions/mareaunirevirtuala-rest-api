const amqp = require("amqplib/callback_api");
const config = require("config.json");
const startPublisher = require("amqp/publisher.js");

const url = config.amqpUrl + "?heartbeat=60";

function start() {
    amqp.connect(url, (err, conn) => {
        if (err) {
            console.error("[AMQP]", err.message);
            return setTimeout(start, 1000);
        }

        conn.on("error", function (err) {
            if (err.message !== "Connection closing") {
                console.error("[AMQP] conn error", err.message);
            }
        });

        conn.on("close", function () {
            console.error("[AMQP] reconnecting");
            return setTimeout(start, 1000);
        });

        console.log("[AMQP] connected");
        amqpConn = conn;
        whenConnected();
    });
}

function whenConnected() {
    startPublisher();
    startWorker();
}