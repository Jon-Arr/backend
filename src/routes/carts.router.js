const cartManager = require("../daos/CartManager")
const productManager = require("../daos/ProductManager")

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

router.post('/:cid/products/:pid', async (req, res) => {
    try {
        let cid = Number(req.params.cid)
        let pid = Number(req.params.pid)
        let quantity = req.body.quantity || 1

        const product = await productManager.getProductById(pid)
        if (!product) {
            return res.status(404).send({ error: "Producto no encontrado" })
        }

        await cartManager.addProductToCart(cid, pid, quantity)

        res.status(201).send({ status: 201 })
    } catch (error) {
        console.error("Error adding product to cart:", error)
        res.status(500).send({ error: "Error interno del servidor" })
    }
})


module.exports = router