const RegisterController = require("../controllers/registerController")
const RegisterValidation = require("../policies/regValidate")
const JWT = require("../util/token")
const BookController = require("../controllers/bookController")

module.exports = (app) => {
    app.use("/api", JWT.jwtVerify)

    app.post("/register", 
        RegisterValidation.register,
        RegisterController.register
    )
    app.post("/login", RegisterController.login)
    app.get("/api/book", BookController.getBooks)
    app.post("/api/book", BookController.addBook)
    // app.delete("/api/book", BookController.deleteBook)
    app.put("/api/book/:id", BookController.changeStatus)
}