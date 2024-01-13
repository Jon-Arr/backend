const cartManager = require("../src/CartManager")

const express = require('express')
const router = express.Router()

router.post("/", async (req, res) => {
    let body = req.body    
    let addCarts = await cartManager.addCart(body)
    addCarts
    res.status(201).send({ status: 201 })
})

router.get('/:cid', async (req, res) => {
    let cid = req.params.cid
    let cart = await cartManager.getCartById(cid)
    if (cart) {
        res.send(cart)
    } else {
        return res.send({ "error": "Carrito no encontrado!" })
    }
})

router.post("/:cid/products/:pid", async (req, res) => {
    let cid = req.params.cid
    let pid = req.params.pid
    let body = req.body    
    let addCarts = await cartManager.addCart(body)
    addCarts
    res.status(201).send({ status: 201 })
})


module.exports = router