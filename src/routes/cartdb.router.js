const express = require('express')
const router = express.Router()
const cartModel = require('../daos/models/cart.model')
const productModel = require('../daos/models/products.model')
const { ObjectId } = require('mongoose').Types

router.get('/', async (req, res) => {
    try{
        let carts = await cartModel.find()
        res.send({result:"success", payload:carts})
    }
    catch(error){
        console.log("Cannot get carts wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error getting data fron DB"
        })
    }
})

router.post("/", async (req, res) =>{
    let body = req.body

    try{
        let result = await cartModel.create(body )
        res.status(200).send({
            status:200,
            result:"Success",
            payload:result
        })
    } catch(error){
        console.log("Cannot create cart wuth mongoose"+error)
        res.status(500).send({
            status:500,
            result:"error",
            errir:"Error creating product"
        })
    }

})

router.get('/:cid', async (req, res) => {
    let cid = req.params.cid
    let cart = await cartModel.findById(cid)
    if (cart) {
        res.send(cart)
    } else {
        return res.send({ "error": "Carrito no encontrado!" })
    }
})

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = Number(req.params.cid)
        let pid = Number(req.params.pid)
        let quantity = req.body.quantity || 1

        const product = await productModel.find({productId:pid})
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" })
        }else{
            quantity = quantity++
        }

        await cartModel.updateOne({ _id: new ObjectId(cid)},{ $push: {products: { productId: pid, quantity: quantity } } })

        res.status(201).send({ status: 201 })
    } catch (error) {
        console.error("Error adding product to cart:", error)
        res.status(500).send({ error: "Error interno del servidor" })
    }
})

module.exports = router