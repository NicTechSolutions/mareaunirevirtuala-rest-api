const config = require("../../config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../helpers/db");
const axios = require("axios");
const User = db.User;

async function auth({
    email,
    password
}) {
    const user = await User.findOne({
        email
    }).select("+hash");
    if (user && bcrypt.compareSync(password, user.hash)) {
        const {
            _id,
            hash,
            ...userForResponse
        } = user.toObject();
        const token = jwt.sign({
            sub: user.id
        }, config.secret);

        return { ...userForResponse,
            token
        };
    }
}

async function create(userParam) {
    if (await User.findOne({
            email: userParam.email
        })) {
        throw "Exista deja un cont asociat acestui email.";
    }

    const user = new User(userParam);

    if (userParam.password) {
        user.hash = bcrypt.hashSync(userParam.password, 5);
    }
    await user.save();

    const {
        _id,
        hash,
        createdAt,
        compliance,
        facebookId,
        ...userForResponse
    } = user.toObject();
    const token = jwt.sign({
        sub: user.id
    }, config.secret);

    return {
        ...userForResponse,
        token
    };
}

async function findByOr(params, fields = []) {
    const user = await User.findOne({
        $or: params
    }, fields);

    return user;
}

async function authFb(accessToken) {
    const url = "https://graph.facebook.com/v3.2/me?fields=id,name,email&access_token=" + accessToken;
    const userParams = await axios.get(url)
        .then((response) => {
            response.data.facebookId = response.data.id;
            // if the user doesn't accept to share the email address
            if (!response.data.email) {
                response.data.email = "defaultEmail@ro100.cf";
            }
            return response.data;
        });

    const params = [{
        facebookId: userParams.facebookId
    }, {
        email: userParams.email
    }];
    return findByOr(params, ["hash", "facebookId"])
        .then((user) => {
            if (!user) {
                return User.create(userParams);
            }
            return user;
        }).then((user) => {
            if (user.hash) {
                throw "Ai deja un cont asociat acestui email.";
            }
            return user;
        }).then((user) => {
            const token = jwt.sign({
                sub: user.id
            }, config.secret);

            const {
                _id,
                hash,
                facebookId,
                createdAt,
                ...userForResponse
            } = user.toObject();

            return { ...userForResponse,
                token
            };
        });
}

async function remove(userId) {
    if (await User.findOne({
            sub: userId
        })) {
        throw "Acest utilizator nu exista.";
    }

    await User.deleteOne({
        _id: userId
    });
}

async function storeCompliance(userId, complianceObj) {
    return User.findByIdAndUpdate(userId, {
        compliance: complianceObj
    }).exec();
}

async function getCompliance(userId) {
    return User.findOne({
        _id: userId
    }).select({
        "compliance": 1,
    }).exec();
}

async function getDrawingsNo() {
    return User.countDocuments({
        drawing: true
    }).exec();
}

async function addDrawing(userId) {
    return User.findOneAndUpdate({
        _id: userId
    }, {
        drawing: true
    }).exec();
}

async function getById(id, fields = []) {
    return await User.findById(id, fields);
}

module.exports = {
    create,
    auth,
    authFb,
    remove,
    storeCompliance,
    getCompliance,
    getDrawingsNo,
    addDrawing,
    getById
};