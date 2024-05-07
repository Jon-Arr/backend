const cartManager = require("../daos/CartManager")
const productManager = require("../daos/ProductManager")
const logger = require('./logger')

const express = require('express')
const router = express.Router()

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
      const productId = req.params.productId
      const product = await productDao.getProductById(productId)
      
      if (!product) {
        logger.warn('Producto no encontrado.')
        return res.status(404).send('Producto no encontrado.')
      }
      
      if (req.user.role === 'premium' && product.owner === req.user.email) {
        logger.warn('No puedes agregar tu propio producto al carrito.')
        return res.status(403).send('No puedes agregar tu propio producto al carrito.')
      }
      
      req.product = product
      next()
    } catch (error) {
      logger.error('Error al verificar la propiedad del producto:', error)
      res.status(500).send('Error al verificar la propiedad del producto.')
    }
  }

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

router.post('/:productId', checkRole('premium'), checkProductOwnership, async (req, res) => {
    try {
      const userId = req.user._id
      const productId = req.params.productId
      const quantity = req.body.quantity || 1
  
      const cartItem = await cartDao.addToCart(userId, productId, quantity)
      res.json(cartItem)
    } catch (error) {
      logger.error('Error al agregar producto al carrito:', error)
      res.status(500).send('Error al agregar producto al carrito.')
    }
  })


module.exports = router