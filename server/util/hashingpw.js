const bcrypt = require("bcrypt")
const saltRounds = 10

module.exports = {
    hashPassword(pw) {
        return bcrypt.hash(pw, saltRounds)
    },
    comparePassword(pw, db_pw) {
        return bcrypt.compare(pw, db_pw)
    }
}