const config = require("../../config.json");
const jackrabbit = require("jackrabbit");
const fs = require("fs");
const path = require("path");
const AWS = require("aws-sdk");
const util = require("util");

const rabbit = jackrabbit(config.rabbit.url);
const exchange = rabbit.default();
const s3 = new AWS.S3({
    accessKeyId: config.aws.key,
    secretAccessKey: config.aws.secretKey
});

const readFileAsync = util.promisify(fs.readFile);

function upload(msg, ack) {
    const userId = msg.id;
    const imgBuffer = new Buffer(msg.data.replace(/^data:image\/\w+;base64,/, ""), "base64");
    const extension = msg.data.split(';')[0].split('/')[1];

    const params = {
        Bucket: config.aws.bucket,
        Key: `ola${userId}.${extension}`,
        Body: imgBuffer,
        ContentEncoding: "base64",
        ContentType: `image/${extension}`
    }

    s3.upload(params)
        .promise()
        .then((data) => {
            console.log(`File uploaded saved ${data.Location}`);
            ack();
        })
        .catch((err) => {
            console.log(err);
        });
}

function work() {
    const queue = exchange.queue({
        name: config.rabbit.upload,
        durable: true
    });
    queue.consume(upload);
}

work();