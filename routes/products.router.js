const productManager = require("../src/ProductManager")

const express = require('express')
const router = express.Router()

router.get("/", async (req, res) => {
    if (req.query.limit) {
        let productLimit = await productManager.getProductLimit(req.query.limit)
        res.send(productLimit)
    } else {

        let products = await productManager.getProducts()
        if (!products) return res.send({ "error": "No exsisten productos" })
        res.send(products)
    }
})

router.get('/:pid', async (req, res) => {
    let pid = req.params.pid
    let product = await productManager.getProductById(pid)
    if (product) {
        res.send(product)
    } else {
        return res.send({ "error": "Producto no encontrado!" })
    }
})

router.post("/", async (req, res) => {
    let body = req.body    
    let addProducts = await productManager.addProduct(body.title, body.description, body.price, body.thumbnail, body.code, body.stock)
    addProducts
    res.status(201).send({ status: 201 })

})

router.put("/:pid", async (req, res) => {
    let pid = req.params.pid
    let body = req.body
    let updProduct = await productManager.updateProduct(pid, body)
    updProduct
    res.send("Producto modificado")
    res.status(201).send({ status: 201 })
})

router.delete("/:pid", async (req, res) => {
    let pid = req.params.pid
    let delProduct = await productManager.deleteProduct(pid)
    delProduct
    res.send("Producto eliminado")
})

module.exports = router