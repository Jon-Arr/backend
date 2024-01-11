const productManager = require("./ProductManager")

const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido</h1><p>Visite /products para ver la lista de productos </p><p>Visite /products/ + id para ver un producto individual</p><p>Visite /products?limit= + numero limite para ver cantidad de productos deseada')
})

app.get('/products', async (req, res) => {

  if (req.query.limit) {
    let productLimit = await productManager.getProductLimit(req.query.limit)
    res.send(productLimit)
  } else {

    let products = await productManager.getProducts()
    if (!products) return res.send({ "error": "No exsisten productos" })
    res.send(products)
  }

})

app.get('/products/:pid', async (req, res) => {
  let pid = req.params.pid
  let producto = await productManager.getProductById(pid)
  if (producto) {
    res.send(producto)
  } else {
    return res.send({ "error": "Producto no encontrado!" })
  }
})

app.listen(port, () => {
  console.log(`Aplicacion corriendo en puerto ${port}`)
})
