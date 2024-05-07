const mongoose = require('mongoose')

const mongoosePaginate = require('mongoose-paginate-v2')

const productCollection = "products"

const productSchema = new mongoose.Schema({

    title: { 
        type: String, 
        required: true 
    },
    description: { 
        type: String, 
        required: true 
    },
    price: { 
        type: Number, 
        required: true 
    },
    thumbnail: { 
        type: String, 
        required: true 
    },
    code: { 
        type: String, 
        required: true 
    },
    stock: { 
        type: Number, 
        required: true 
    },
    owner: { 
        type: String, 
        default: 'admin'
    }

})

productSchema.plugin(mongoosePaginate)


module.exports = mongoose.model(productCollection, productSchema)