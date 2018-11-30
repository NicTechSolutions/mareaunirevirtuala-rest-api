const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        default: "",
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
        default: "",
        select: false
    },
    compliance: {
        type: Map,
        of: Number,
        default: {
            "all": false,
            "next": false,
            "marketing": false
        },
        select: false
    },
    drawing: {
        type: Boolean,
        default: false
    },
    count: {
        type: Number,
        default: 0
    }
}, {
    versionKey: false
});

schema.set("toJSON", {
    virtuals: true
});

module.exports = mongoose.model("User", schema);