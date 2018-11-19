const expressJwt = require("express-jwt");
const config = require("config.json");
const userService = require("src/users/user.service");


async function isRevoked(req, payload, done) {
    const user = await userService.getById(payload.sub);

    if (!user) {
        return done(null, true);
    }

    done();
}

function jwt() {
    const secret = config.secret;
    return expressJwt({
        secret,
        isRevoked
    }).unless({
        path: [
            "/api/users/login",
            "/api/users/register",
            "/api/users/fb/login",
            "/api/email/forgot",
            "/api/password/reset",
        ]
    });
}

module.exports = jwt;