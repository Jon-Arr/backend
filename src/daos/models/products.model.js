const mongoose = require ('mongoose')

const mongoosePaginate = require('mongoose-paginate-v2')

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

productSchema.plugin(mongoosePaginate)


module.exports = mongoose.model(productCollection, productSchema)