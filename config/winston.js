const appRoot = require("app-root-path");
const winston = require("winston");

const options = {
    file: {
        level: "info",
        filename: `${appRoot}/storage/logs/app.log`,
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.json()),
        maxsize: 5242880, // 5MB
        colorize: false,
    },
    console: {
        level: "info",
        handleExceptions: true,
        format: winston.format.combine(
            winston.format.colorize(),
            winston.format.timestamp({
                format: 'YYYY-MM-DD HH:mm:ss'
            }),
            winston.format.simple()),
    }
};

const logger = winston.createLogger({
    transports: [
        new winston.transports.File(options.file),
        new winston.transports.Console(options.console)
    ],
    exitOnError: false, // do not exit on handled exceptions
});

logger.stream = {
    write: (message, encoding) => {
        logger.info(message);
    },
};

module.exports = logger;