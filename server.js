require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const compression = require("compression");
const helmet = require("helmet");
const jwt = require("src/helpers/jwt");
const errorHandler = require("src/helpers/error-handler");
const morgan = require("morgan");
const winston = require("config/winston");
const config = require("config.json");
const path = require("path");

app.use(express.static(path.join(__dirname, config.pathToBuild)));
app.use(helmet());
app.use(morgan("combined", {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: winston.stream
}));
app.use(bodyParser.urlencoded({
    extended: true,
    limit: "50mb"
}));
app.use(bodyParser.json({
    limit: '50mb'
}));
app.use(cors());
app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(__dirname + `/${config.pathToBuild}/index.html`));
});
app.use(jwt());
app.use("/api/users", require("src/users/user.controller"));
app.use("/api/drawings", require("src/drawings/drawing.controller"));
app.use("/api/password", require("src/forgot-pass/forgot-pass.controller"));
app.use(compression());
app.use(errorHandler);


// both 4000, nginx will handle the request through the reverse proxy
const port = process.env.NODE_ENV === "production" ? 4000 : 4000;
const server = app.listen(port, function () {
    winston.info(`Server listening on port : ${port}`);
});