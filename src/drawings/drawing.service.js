const userService = require("src/users/user.service");
const winston = require("../../config/winston");
const appRoot = require("app-root-path");
const base64Img = require("base64-img-promise");

const LIMIT = 10;

async function isLimitReached(userId) {
    const userCount = await userService.getUserDrawingsCount(userId);
    console.log(userCount);
    if (userCount > (LIMIT - 1)) {
        return true;
    }
    return false;
}

async function upload(msgDto) {
    if (await isLimitReached(msgDto.id) == true) {
        throw "Ai atinsa limita adminisa de incarcat desene";
    }

    if (msgDto.data) {
        const path = `${appRoot}/storage/upload`;
        return Promise.all([
            base64Img.img(msgDto.data, path, msgDto.filename), userService.addDrawing(msgDto.id)
        ]);
    }
}

module.exports = {
    upload
};