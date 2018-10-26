const mongoose = require("mongoose")

const tradeSchema = new mongoose.Schema({
    initiater: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiver: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    initiaterBook: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    receiverBook: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    status: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('Trade', tradeSchema);