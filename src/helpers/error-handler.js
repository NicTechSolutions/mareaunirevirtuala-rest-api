const logger = require("config/winston") ;

function errorHandler(err, req, res, next) {
    if (typeof (err) === "string") {
        logger.warn(err);
        return res.status(400).json({
            message: err
        });
    }

    if (err.name === "ValidationError") {
        logger.warn(err);
        return res.status(400).json({
            message: err.name
        });
    }

    if (err.name === "UnauthorizedError") {
        logger.warn(err);
        return res.status(401).json({
            message: "Invalid Token"
        });
    }

    logger.error(err);
    return res.status(500).json({
        message: err.message
    });
}
module.exports = errorHandler;