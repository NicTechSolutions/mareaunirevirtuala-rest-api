const mime = require('mime-types')

module.exports = {
    upload
};

async function upload(drawing, userId) {
    const extension = mime.extension(drawing.mimetype);
    drawing.mv("upload/" + userId + "." + extension, function (err) {
        
    });
}