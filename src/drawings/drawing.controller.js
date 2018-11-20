const router = require("express").Router();
const drawingService = require("src/drawings/drawing.service");

function upload(req, res, next) {
    const dto = {
        id: req.user.sub,
        data: req.body.drawing
    };
    drawingService.upload(dto)
        .then(() => res.json({
            message: "Uploaded with success."
        }))
        .catch((err) => next(err));

}

// routes
router.post("/upload", upload);

module.exports = router;