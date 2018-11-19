const config = require("config.json");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("src/helpers/db");
const User = db.User;
const axios = require("axios");


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
        throw "Email already used";
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

async function createFb(userParam) {
    let user = await User.findOne({
        facebookId: userParam.facebookId
    }).select("+facebookId");
    if (!user) {
        user = new User(userParam);
        await user.save();
    }

    return user;
}

async function authFb(accessToken) {
    const url = "https://graph.facebook.com/v3.2/me?fields=id,name,email&access_token=" + accessToken;
    const userParam = await axios.get(url)
        .then((response) => {
            response.data.facebookId = response.data.id;
            // if the user doesn't accept to share the email address
            if (!response.data.email) {
                response.data.email = "defaultEmail@ro100.cf";
            }
            return response.data;
        });

    const user = await createFb(userParam);
    const {
        _id,
        ...userForResponse
    } = user.toObject();

    return userForResponse;
}

async function remove(userId) {
    if (await User.findOne({
            sub: userId
        })) {
        throw "User doesn't exists.";
    }

    await User.deleteOne({
        _id: userId
    });
}

async function storeCompliance(userId, complianceObj) {
    User.findByIdAndUpdate(userId, {
        compliance: complianceObj
    }, (err, user) => {
        if (err) {
            throw "The compliance settings store process failed."
        }
    });
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
    getById
};