const mongoose = require('mongoose')

const cartCollection = "carts"

const cartSchema = new mongoose.Schema({
    products: {
        productId: String,
        quantity: Number
    }
})

module.exports = mongoose.model(cartCollection, cartSchema)