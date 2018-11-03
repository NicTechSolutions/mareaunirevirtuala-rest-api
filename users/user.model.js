const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const schema = new Schema({
    name: {
        type: String,
        required: true
    },
    hash: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
}, {
    versionKey: false
});

schema.set('toJSON', {
    virtuals: true
});

module.exports = mongoose.model('User', schema);