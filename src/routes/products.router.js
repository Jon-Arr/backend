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

/**
 * @swagger
 * components:
 *   schemas:
 *     Product:
 *       type: object
 *       required:
 *         - title
 *         - description
 *         - price
 *         - thumbnail
 *         - code
 *         - stock
 *       properties:
 *         id:
 *           type: integer
 *           description: Identificador único del producto
 *         title:
 *           type: string
 *           description: Título del producto
 *         description:
 *           type: string
 *           description: Descripción del producto
 *         price:
 *           type: number
 *           description: Precio del producto
 *         thumbnail:
 *           type: string
 *           description: URL de la imagen del producto
 *         code:
 *           type: string
 *           description: Código del producto
 *         stock:
 *           type: integer
 *           description: Stock disponible del producto
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Obtiene todos los productos
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 *   post:
 *     summary: Crea un nuevo producto
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '201':
 *         description: Producto creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '400':
 *         description: Datos de entrada inválidos
 */

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Obtiene un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a obtener
 *         schema:
 *           type: integer
 *     responses:
 *       '200':
 *         description: Respuesta exitosa
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado
 *   put:
 *     summary: Actualiza un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a actualizar
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       '200':
 *         description: Producto actualizado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *       '404':
 *         description: Producto no encontrado
 *   delete:
 *     summary: Elimina un producto por su ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID del producto a eliminar
 *         schema:
 *           type: integer
 *     responses:
 *       '204':
 *         description: Producto eliminado exitosamente
 *       '404':
 *         description: Producto no encontrado
 */