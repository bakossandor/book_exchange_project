const User = require("../models/user")
const Hash = require("../util/hashingpw")
const JWT = require("../util/token")

module.exports = {
    async register (req, res) {
        try {
            const pw = await Hash.hashPassword(req.body.password)
            const user = new User({
                email: req.body.email,
                userName: req.body.userName,
                password: pw
            })
            await user.save()
            res.status(201).send({
                message: `${user.email} registered successfully`
            })
        } catch (error) {
            if (error.name === "MongoError") {
                if (error.code === 11000) {
                    if (error.errmsg.indexOf("userName") !== -1) {
                        res.status(400).send({
                            error: "username is already used"
                        })
                    } else if (error.errmsg.indexOf("email") !== -1) {
                        res.status(400).send({
                            error: "email is already used"
                        })
                    }
                }
            } else {
                res.status(400).send({
                    error
                })
            }
        }
    },
    
    async login (req, res) {
        const {email, password} = req.body
        try {
            const loginUser = await User.findOne({
                email
            })

            console.log("loginUser", loginUser)

            if (!loginUser) {
                return res.status(401).send({
                    error: "Wrong credentials"
                })
            }

            const validPassword = await Hash.comparePassword(password, loginUser.password)
            if (!validPassword) {
                return res.status(401).send({
                    error: "wrong credentials"
                })
            }

            const token = await JWT.jwtSignUser({
                id: loginUser._id,
                email: loginUser.email
            })

            res.header({Authorization: `Bearer ${token}`}).send({message: "Successfully logged in"})

        } catch (error) {
            console.log("login request error", error)
            res.status(400).send({
                error: "Bad request"
            })
        }
    }
}
