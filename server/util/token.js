const jwt = require('jsonwebtoken')
const config = require("../config/config")

module.exports = {
    jwtSignUser(userInfo) {
        return jwt.sign(userInfo, config.jwtSecret, {
            expiresIn: config.jwtExpire
        })
    },

    async jwtVerify (req, res, next) {
        const token = req.get("Authorization")
        await jwt.verify(token, config.jwtSecret, (err, decoded) => {
            if (err) {
                res.status(401).send({error: "Unauthorized"})
            }
            next()
        });
    }
    
}