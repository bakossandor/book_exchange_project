const jwt = require("jsonwebtoken")
const jwt_decode = require("jwt-decode")
const config = require("../config/config")

module.exports = {
    jwtSignUser(userInfo) {
        return jwt.sign(userInfo, config.jwtSecret, {
            expiresIn: config.jwtExpire
        })
    },

    async jwtVerify(req, res, next) {
        try {
            const token = req.get("Authorization").split(" ")[1]
            await jwt.verify(token, config.jwtSecret)
            next()
        } catch (err) {
            res.status(401).send({error: "Unauthorized"})
        }
    },

    // decodeUserId(token) {
    //     return jwt_decode(token)
    // }
}