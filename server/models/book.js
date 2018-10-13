const mongoose = require("mongoose")

const BookSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    info: String,
    listedAt: Date,
    listedBy: {
        type: String,
        required: true
    },
    status: String
});

module.exports = mongoose.model('Book', BookSchema);