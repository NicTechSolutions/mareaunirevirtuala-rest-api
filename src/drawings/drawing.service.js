const mime = require("mime-types")
const publish = require("src/queue/upload/publisher");

async function upload(drawing, userId) {
    const extension = mime.extension(drawing.mimetype);
    const filename = `${userId}.${extension}`;

    drawing.mv(`upload/${filename}`, function (err) {
        if (err) {
            console.log(err);
        }

        publish(filename);
    });
}

module.exports = {
    upload
};