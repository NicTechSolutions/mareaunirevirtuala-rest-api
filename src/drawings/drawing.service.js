const publish = require("src/queue/publisher");

async function upload(msgDto) {
    publish(msgDto);
}

module.exports = {
    upload
};