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

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       required:
 *         - productId
 *         - quantity
 *       properties:
 *         productId:
 *           type: integer
 *           description: ID del producto en el carrito
 *         quantity:
 *           type: integer
 *           description: Cantidad del producto en el carrito
 */

/**
 * @swagger
 * /api/carts/{userId}:
 *   get:
 *     summary: Obtiene el carrito de un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       '404':
 *         description: Carrito no encontrado
 *   post:
 *     summary: Agrega un producto al carrito de un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CartItem'
 *     responses:
 *       '201':
 *         description: Producto agregado al carrito exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: Datos de entrada inválidos
 *       '404':
 *         description: Carrito no encontrado
 *   delete:
 *     summary: Elimina un producto del carrito de un usuario por su ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         description: ID del usuario
 *         schema:
 *           type: integer
 *       - in: query
 *         name: productId
 *         required: true
 *         description: ID del producto a eliminar del carrito
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Producto eliminado del carrito exitosamente
 *       '404':
 *         description: Carrito no encontrado o producto no encontrado en el carrito
 */