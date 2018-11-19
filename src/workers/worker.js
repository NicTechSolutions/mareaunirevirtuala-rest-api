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
    const filename = msg;
    const file = path.join(__dirname, "../../", "upload", filename);

    readFileAsync(file)
        .then((fileBuffer) => {
            return {
                Bucket: config.aws.bucket,
                Key: filename,
                Body: fileBuffer
            };
        })
        .then((params) => {
            return s3.putObject(params);
        })
        .then((data) => {
            console.log(`File uploaded successfully at ${data.Location}`)
            // ack();
        })
        .catch((err) => {
            console.log(err);
        });


    // fs.readFile(file, (err, data) => {
    //     if (err) {
    //         console.log(err);
    //         throw err;
    //     }
    //     const params = {
    //         Bucket: config.aws.bucket,
    //         Key: filename,
    //         Body: file
    //     };
    //     s3.upload(params, function (s3Err, data) {
    //         if (s3Err) {
    //             console.log(s3Err);
    //             throw s3Err;
    //         } else {
    //             console.log(`File uploaded successfully at ${data.Location}`)
    //             ack();
    //         }
    //     });
    // });
}

function work() {
    const queue = exchange.queue({
        name: config.rabbit.upload,
        durable: true
    });
    queue.consume(upload);
}

work();