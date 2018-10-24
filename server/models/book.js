const mongoose = require("mongoose")
const mongoosePaginate = require('mongoose-paginate')

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
    listedById: {
        type: String,
        required: true,
    },
    status: String,
    tradeStatus: String,
    traderId: String,
    traderEmail: String,
    traderUsername: String,
    traderBookInfo: String
})

BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Book', BookSchema)