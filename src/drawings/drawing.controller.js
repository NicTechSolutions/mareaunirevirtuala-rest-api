const express = require("express");
const router = express.Router();
const userService = require("src/users/user.service");
const drawingService = require("./drawing.service");

function upload(req, res, next) {
    if (typeof req.files == "undefined" || typeof req.files.drawing == "undefined") {
        return res.status(400).json({
            message: "No file was uploaded."
        });
    }

    drawingService.upload(req.files.drawing, req.user.sub)
        .then(() => res.json({
            message: "Uploaded with success."
        }))
        .catch((err) => next(err));

}

// routes
router.post("/upload", upload);

module.exports = router;

