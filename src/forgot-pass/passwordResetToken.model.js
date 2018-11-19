const mongoose = require('mongoose');

const schema = mongoose.Schema({
    userEmail: {
        type: String,
        required: true
    },
    token: {
        type: String,
        require: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    }
});

schema.set("toJSON", {
    virtuals: true
});

module.exports = mongoose.model("PasswordResetToken", schema);