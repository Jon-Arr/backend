const Products = require('./models/products.model')

class ProductsDao{
    static async getAllProducts(){
        return Products.find().lean()
    }
    static async postProduct(title, description, price, thumbnail, code, stock){
        return new Products({title, description, price, thumbnail, code, stock}).save()
    }
    static async updtProduct(id, data){
        return Products.findOneAndUpdate({_id:id}, data)
    }
    static async delProduct(id){
        return Products.findByIdAndDelete(id)
    }
}

module.exports = ProductsDao