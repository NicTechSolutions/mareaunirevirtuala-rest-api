const mime = require("mime-types")
const publish = require("src/queue/publisher");

async function upload(drawing, userId) {
    const extension = mime.extension(drawing.mimetype);
    const filename = `${userId}.${extension}`;

    publish(filename);
    return drawing.mv(`upload/${filename}`);
}

module.exports = {
    upload
};