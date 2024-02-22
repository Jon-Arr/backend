const express = require('express')
const router = express.Router()
const productModel = require ('../daos/models/products.model')

router.get('/', async (req, res) => {
    try{
        // let products = await productModel.find()

        // const { page = 1, limit = 10 } = req.query
        // const products = await productModel.paginate({}, { page: parseInt(page), limit: parseInt(limit) })

        const { page = 1, limit = 10, stock, sort = 'price', order = 'asc' } = req.query

        const query = {}
        if (stock) {
            query.stock = stock
        }

        const options = {
            page: parseInt(page),
            limit: parseInt(limit),
            sort: { [sort]: order === 'asc' ? 1 : -1 }
        }

        const products = await productModel.paginate(query, options)

        res.send({result:"success", payload:products})
    }
    catch(error){
        console.log("Cannot get products wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error getting data fron DB"
        })
    }
})

router.post("/", async (req, res) =>{
    let {title, description, price, thumbnail, code, stock} = req.body

    if (!title || !description || !price || !thumbnail || !stock){
        res.status(400).send({
            status:400,
            result:"error",
            error:"Complete all values"
        })
    }

    try{
        let result = await productModel.create({
            title, description, price, thumbnail, code, stock
        })
        res.status(200).send({
            status:200,
            result:"Success",
            payload:result
        })
    } catch(error){
        console.log("Cannot create product wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error creating product"
        })
    }

})

router.put("/:pid", async (req, res) =>{
    let {pid} = req.params

    let replaceProduct  = req.body

    if (!pid || !replaceProduct.title || !replaceProduct.description || !replaceProduct.price || !replaceProduct.thumbnail || !replaceProduct.stock){
        res.status(400).send({
            status:400,
            result:"error",
            error:"Complete all values"
        })
    }

    try{
        let result = await productModel.updateOne({_id:pid}, replaceProduct)
        res.status(200).send({
            status:200,
            result:"Success",
            payload:result
        })
    } catch(error){
        console.log("Cannot update product wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error updating product"
        })
    }

})

router.delete("/:pid", async (req, res) =>{
    let {pid} = req.params

    try{
        let result = await productModel.deleteOne({_id:pid})
        res.status(200).send({
            status:200,
            result:"Success",
            payload:result
        })
    } catch(error){
        console.log("Cannot delete product wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error deleting product"
        })
    }

})

module.exports = router