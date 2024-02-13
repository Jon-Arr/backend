const mongoose = require ('mongoose')

const messageCollection = "messages"

const messageSchema = new mongoose.Schema({
    user: String,
    message: String

})

module.exports = mongoose.model(messageCollection, messageSchema)