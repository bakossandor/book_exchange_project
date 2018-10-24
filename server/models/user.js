const mongoose = require("mongoose")

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        required: true
    },
    userName: {
        type: String,
        unique: true,
        required: true
    },
    password: String,
    books: [
        {type: mongoose.Schema.Types.ObjectId}
    ],
    offeredBooks: [
        {type: mongoose.Schema.Types.ObjectId}
    ]
});

module.exports = mongoose.model('User', userSchema);