const publish = require("src/queue/publisher");

async function upload(msgDto) {
    console.log('====================================');
    // console.log(msgDto);
    console.log('====================================');
    publish(msgDto);
}

module.exports = {
    upload
};