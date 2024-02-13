const mongoose = require ('mongoose')

const productCollection = "products"

const productSchema = new mongoose.Schema({
    title: String,
    description: String,
    thumbnail: String,
    stock: Number,
    code: {
        type: String,
        unique:true
    },
    price: Number

})

module.exports = mongoose.model(productCollection, productSchema)