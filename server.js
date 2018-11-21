require("rootpath")();
const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("src/helpers/jwt");
const errorHandler = require("src/helpers/error-handler");
const morgan = require("morgan");
const winston = require("config/winston");

app.use(morgan("combined", {
    skip: function (req, res) {
        return res.statusCode < 400
    },
    stream: winston.stream
}));
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use("/api/users", require("src/users/user.controller"));
app.use("/api/drawings", require("src/drawings/drawing.controller"));
app.use("/api/password", require("src/forgot-pass/forgot-pass.controller"));
app.use(errorHandler);

const port = process.env.NODE_ENV === "production" ? 80 : 4000;
const server = app.listen(port, function () {
    winston.info(`Server listening on port : ${port}`);
});