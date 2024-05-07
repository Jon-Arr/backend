const productManager = require("../daos/ProductManager")

const express = require('express')
const router = express.Router()
const productDao = require('../daos/products.dao')
const logger = require('./logger')


// Middleware check rol
function checkRole(role) {
    return (req, res, next) => {
      if (req.user.role === role || req.user.role === 'admin') {
        next()
      } else {
        logger.warn('No tienes permiso para realizar esta acción.')
        res.status(403).send('No tienes permiso para realizar esta acción.')
      }
    }
  }

  async function checkProductOwnership(req, res, next) {
    try {
      const productId = req.params.id
      const product = await productDao.getProductById(productId)
      
      if (!product) {
        logger.warn('Producto no encontrado.')
        return res.status(404).send('Producto no encontrado.')
      }
      
      if (req.user.role === 'premium' && product.owner !== req.user.email) {
        logger.warn('No tienes permiso para realizar esta acción.')
        return res.status(403).send('No tienes permiso para realizar esta acción.')
      }
      
      req.product = product
      next()
    } catch (error) {
      logger.error('Error al verificar la propiedad del producto:', error)
      res.status(500).send('Error al verificar la propiedad del producto.')
    }
  }

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

router.post('/', checkRole('premium'), async (req, res) => {
    try {
      const { title, description, price, thumbnail, code, stock } = req.body
      const owner = req.user.email
      const product = await productDao.createProduct(title, description, price, thumbnail, code, stock, owner)
      res.json(product)
    } catch (error) {
      logger.error('Error al crear el producto:', error)
      res.status(500).send('Error al crear el producto.')
    }
  })

router.post("/", async (req, res) => {
    let body = req.body    
    let addProducts = await productManager.addProduct(body.title, body.description, body.price, body.thumbnail, body.code, body.stock)
    addProducts
    res.status(201).send({ status: 201 })

    io.emit('updateProducts', products)
})

// router.put("/:pid", async (req, res) => {
//     let pid = req.params.pid
//     let body = req.body
//     let updProduct = await productManager.updateProduct(pid, body)
//     updProduct
//     res.send("Producto modificado")
//     res.status(201).send({ status: 201 })

//     io.emit('updateProducts', products)
// })
router.put('/:id', checkRole('premium'), checkProductOwnership, async (req, res) => {
    try {
      const productId = req.params.id
      const { title, description, price, thumbnail, code, stock } = req.body
      const updatedProduct = await productDao.updateProduct(productId, title, description, price, thumbnail, code, stock)
      res.json(updatedProduct)
    } catch (error) {
      logger.error('Error al actualizar el producto:', error)
      res.status(500).send('Error al actualizar el producto.')
    }
  })

// router.delete("/:pid", async (req, res) => {
//     let pid = req.params.pid
//     let delProduct = await productManager.deleteProduct(pid)
//     delProduct
//     res.send("Producto eliminado")

// })

router.delete('/:id', checkRole('premium'), checkProductOwnership, async (req, res) => {
    try {
      const productId = req.params.id
      await productDao.deleteProduct(productId)
      res.json({ message: 'Producto eliminado correctamente.' })
    } catch (error) {
      logger.error('Error al eliminar el producto:', error)
      res.status(500).send('Error al eliminar el producto.')
    }
  })

module.exports = router