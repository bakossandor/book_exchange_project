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
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    listedByUserName: {
        type: String,
        required: true
    },
    status: String,
    tradeStatus: String,
    traderUserId: mongoose.Schema.Types.ObjectId,
    traderUserName: String,
    traderEmail: String,
    traderBookId: mongoose.Schema.Types.ObjectId, 
})

BookSchema.plugin(mongoosePaginate);

module.exports = mongoose.model('Book', BookSchema)