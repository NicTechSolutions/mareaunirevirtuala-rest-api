const db = require("src/helpers/db");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("config.json");
const getTemplate = require("templates/resetpassword.js");
const publish = require("src/queue/publisherEmail");
const User = db.User;
const PasswordResetToken = db.PasswordResetToken;


var rand = function () {
    return Math.random().toString(36).substr(2); // remove `0.`
};

var genToken = function () {
    return rand() + rand(); // to make it longer
};


async function resetPassword(token, newPassword) {
    return db.PasswordResetToken.find({
        'token': token
    }, (err, resetTokens) => {
        if (!resetTokens[0]) {
            throw "Invalid reset password token";
        }
        return db.User.updateOne({
                "email": resetTokens[0].userEmail
            }, //condition
            {
                $set: {
                    "hash": bcrypt.hashSync(newPassword, 5)
                }
            }, //update
            (err, users) => {
                if (err) {
                    throw err;
                }
            }
        );
    })

}

async function sendForgotPasswordEmail(target) {
    const user = await User.findOne({
        email: target
    });
    if (!user) {
        throw "Nu exista cont asociat acestui email";
    }

    const resetTokenObj = new PasswordResetToken({
        'userEmail': target,
        'token': genToken()
    });

    resetTokenObj.save().then((resetToken) => {
        const body = getTemplate(target, resetToken.token);
        publish(body);
    });
}


module.exports = {
    sendForgotPasswordEmail,
    resetPassword
};