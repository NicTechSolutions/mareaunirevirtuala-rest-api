const db = require("src/helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config.json");
const getTemplate = require("templates/resetpassword.js");
const mail = require("src/helpers/mail");
const User = db.User;
const PasswordResetToken = db.PasswordResetToken;


var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var genToken = function () {
    return rand() + rand(); // to make it longer
};


async function resetPassword(token, newPassword) {
    return PasswordResetToken.findOneAndRemove({
            token: token
        }).exec()
        .then((resetTokenObj) => {
            return User.findOneAndUpdate({
                email: resetTokenObj.userEmail
            }, {
                hash: bcrypt.hashSync(newPassword, 5)
            }).exec();
        });

}

async function sendForgotPasswordEmail(target) {
    const user = await User.findOne({
        email: target
    }).select("+facebookId");
    if (!user) {
        throw "Nu exista cont asociat acestui email";
    }
    if (user.facebookId) {
        throw "Acest email a fost folosit la conectarea cu Facebook."
    }

    const resetTokenObj = new PasswordResetToken({
        'userEmail': target,
        'token': genToken()
    });

    return resetTokenObj.save().then((resetToken) => {
        const body = getTemplate(target, resetToken.token);
        return mail.sendEmail(body);
    });
}


module.exports = {
    sendForgotPasswordEmail,
    resetPassword
};