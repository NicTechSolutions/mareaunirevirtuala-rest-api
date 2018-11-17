const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        select: false
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now,
        select: false
    },
    facebookId: {
        type: String,
        select: false
    },
    compliance: {
        type: Map,
        of: String,
        select: false
    }
}, {
    versionKey: false
});

schema.set("toJSON", {
    virtuals: true
});

module.exports = mongoose.model("User", schema);