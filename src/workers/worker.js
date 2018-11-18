const config = require("../../config.json");
const jackrabbit = require("jackrabbit");
const fs = require('fs');
const path = require('path');
const AWS = require('aws-sdk');

const rabbit = jackrabbit(config.rabbit.url);
const exchange = rabbit.default();
const s3 = new AWS.S3({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secretKey
});

function work() {
    const queue = exchange.queue({
        name: config.rabbit.upload,
        durable: true
    });
    queue.consume(upload);
}

function upload(msg, ack) {
    const filename = msg;
    const file = path.join(__dirname, "../../", "upload", filename);

    fs.readFile(file, (err, data) => {
        if (err) {
            console.log(err);
        };
        const params = {
            Bucket: config.aws.bucket,
            Key: filename,
            Body: file
        };
        s3.upload(params, function (s3Err, data) {
            if (s3Err) {
                throw s3Err
                console.log(s3Err);
            } else {
                console.log(`File uploaded successfully at ${data.Location}`)
                ack();
            }
        });
    });
}

work();