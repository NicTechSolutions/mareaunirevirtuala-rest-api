const publish = require("src/queue/publisher");
const userService = require("src/users/user.service");

async function upload(msgDto) {
    publish(msgDto);
    const userId = msgDto.id;
    return userService.addDrawing(userId);
}

module.exports = {
    upload
};