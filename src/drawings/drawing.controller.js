const router = require("express").Router();
const drawingService = require("src/drawings/drawing.service");

function upload(req, res, next) {
    const dto = {
        id: req.user.sub,
        data: req.body.drawing
    };
    drawingService.upload(dto)
        .then(() => res.json({
            message: "Acum esti partea din Marea Unire Virtuala."
        }))
        .catch((err) => next(err));
}

// routes
router.post("/upload", upload);

module.exports = router;