const RegisterController = require("../controllers/registerController")
const RegisterValidation = require("../policies/regValidate")
const JWT = require("../util/token")

module.exports = (app) => {
    app.use("/api", JWT.jwtVerify)
    app.post("/register", 
        RegisterValidation.register,
        RegisterController.register
    )
    app.post("/login", 
        RegisterController.login
    )
    app.get("/api")
}