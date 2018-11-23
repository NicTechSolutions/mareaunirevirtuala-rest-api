const publish = require("src/queue/publisher");
const userService = require("src/users/user.service");

async function upload(msgDto) {
    if (msgDto.data) {
        publish(msgDto);
        const userId = msgDto.id;
        return userService.addDrawing(userId);
    }
    throw "A aparut o problema la incarcare. Te rugam sa incerci din nou.";
}

module.exports = {
    upload
};