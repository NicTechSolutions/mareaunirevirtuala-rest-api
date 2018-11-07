const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("helpers/db");
const User = db.User;

module.exports = {
    create,
    auth,
    getById
};

async function auth({
    email,
    password
}) {
    const user = await User.findOne({
        email
    }).select("+hash");
    if (user && bcrypt.compareSync(password, user.hash)) {
        const {
            hash,
            _id,
            createdAt,
            ...userWithoutHash
        } = user.toObject();
        const token = jwt.sign({
            sub: user.id
        }, config.secret);

        return { ...userWithoutHash,
            token
        };
    }
}

async function create(userParam) {
    if (await User.findOne({
            email: userParam.email
        })) {
        throw "Email already used";
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 5);
    }

    await user.save();
}

async function getById(id) {
    return await User.findById(id);
}