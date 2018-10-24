const RegisterController = require("../controllers/registerController")
const RegisterValidation = require("../policies/regValidate")
const JWT = require("../util/token")
const BookController = require("../controllers/bookController")

module.exports = (app) => {
    // app.use("/api", JWT.jwtVerify)

    app.post("/register", 
        RegisterValidation.register,
        RegisterController.register
    )

    app.post("/login", RegisterController.login)

    app.get("/api/user/:id/book", BookController.getUserBooks)

    app.get("/api/user/:id/tradebooks", BookController.getTradeBooks)

    app.get("/api/book", BookController.getBooks)

    app.post("/api/book", BookController.addBook)

    app.delete("/api/book/:id", BookController.deleteBook)

    app.put("/api/book/:id", BookController.changeStatus)

    app.post("/api/book/cancel", BookController.declineRequest)

    app.post("/api/book/trade", BookController.tradeRequest)

}