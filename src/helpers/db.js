const config = require("config.json");
const mongoose = require("mongoose");

mongoose.connect(config.connectionString, {
  useCreateIndex: true,
  useNewUrlParser: true
});
mongoose.Promise = global.Promise;

module.exports = {
  User: require("../users/user.model"),
  PasswordResetToken: require("../forgot-pass/passwordResetToken.model")
};