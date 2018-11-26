const userService = require("src/users/user.service");
const winston = require("../../config/winston");
const appRoot = require("app-root-path");
const base64Img = require("base64-img-promise");

async function upload(msgDto) {
    if (msgDto.data) {
        const path = `${appRoot}/storage/upload`;
        return Promise.all([
            base64Img.img(msgDto.data, path, msgDto.id), userService.addDrawing(msgDto.id)
        ]);
    }
}

module.exports = {
    upload
};