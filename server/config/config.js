module.exports = {
    port: process.env.PORT || 8000,
    db: process.env.MONGO || "mongodb://localhost:27017/books",
    jwtSecret: process.env.JWT_SECRET || "secret_secret",
    jwtExpire: "1w"
}