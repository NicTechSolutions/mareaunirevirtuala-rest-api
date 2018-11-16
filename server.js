require("rootpath")();
const express = require("express");
const fileUpload = require("express-fileupload");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");
const jwt = require("helpers/jwt");
const errorHandler = require("helpers/error-handler");

app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(fileUpload());
app.use(bodyParser.json());
app.use(cors());
app.use(jwt());
app.use("/api/users", require("./users/user.controller"));
app.use("/api/drawings", require("./drawings/drawing.controller"));
app.use(errorHandler);

const port = process.env.NODE_ENV === "production" ? 80 : 4000;
const server = app.listen(port, function () {
    console.log("Server listening on port " + port);
});