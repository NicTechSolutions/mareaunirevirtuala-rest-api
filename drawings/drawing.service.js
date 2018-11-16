const mime = require('mime-types')

async function upload(drawing, userId) {
    const extension = mime.extension(drawing.mimetype);
    drawing.mv("upload/" + userId + "." + extension, function (err) {
        
    });
}

module.exports = {
    upload
};