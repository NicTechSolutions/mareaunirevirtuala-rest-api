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

function imageUrl(req, res, next) {
    const userId = req.user.sub;

    res.json(`upload/${userId}.jpg`);
}

// routes
router.post("/upload", upload);
router.get("/", imageUrl);

module.exports = router;