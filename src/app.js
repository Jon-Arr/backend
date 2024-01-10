const productManager = require("./ProductManager")

const express = require('express')
const app = express()
const port = 3000

app.use(express.urlencoded({ extended: true }))

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido</h1><p>Visite /products para ver la lista de productos </p><p>Visite /products/ + id para ver un producto individual</p><p>Visite /products?limit= + numero limite para ver cantidad de productos deseada')
})

app.get('/products', (req, res) => {
  
  if (req.query.limit) {
    let productLimit = productManager.getProductLimit(req.query.limit)
    res.send(productLimit)
  }
  
  let products = productManager.getProducts()
  if(!products) return res.send({"error":"No exsisten productos"})
  res.send(products)


})

app.get('/products/:idProduct', (req, res) => {
  let idProduct = req.params.idProduct
  let producto = productManager.getProductById(idProduct)
  if (producto) {
    res.send(producto)
  } else {
    return res.send({ "error": "Producto no encontrado!" })
  }
})

app.listen(port, () => {
  console.log(`Aplicacion corriendo en puerto ${port}`)
})

// ***usar productmanager
// ***en app js importar productmanager
// ***ruta products que lea productos y devuelva en un objeto
// ***agregar soporte por query param el valor ?limit= que recibe un limite de resultados
// ***si no se recibe query  devolver todo
// ***si recibe limite devolver el nro de producto solicitado
// usar github para entrega
////*** */ src con app.js y productmanager dentro
////*** package.json con la info del proyecto
////***no incluir node_modules
