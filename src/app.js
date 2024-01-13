//Imports
const products = require("../routes/products.router")
const carts = require("../routes/carts.router")
const express = require('express')

const app = express()
const port = 8080

//Middleware
app.use(express.json())
app.use(express.static("public"))

//Rutas
app.use("/api/products", products)
app.use("/api/carts", carts)

//Reglas
app.get("/ping", (req, res) => {
  res.send("Pong")
})

app.get('/', (req, res) => {
  res.send('<h1>Bienvenido</h1><p>Visite /api/products/ para ver la lista de productos </p><p>Visite /api/products/ + id para ver un producto individual</p><p>Visite /api/products?limit= + numero limite para ver cantidad de productos deseada')
})

app.listen(port, () => {
  console.log(`Aplicacion corriendo en puerto ${port}`)
})



// ***cambiar puerto a 8080
// ***dos rutas /products /carts
// ***-> el GET raiz productos en /api/products/ con get todos los productos de la base incluido ?limit
// ***-> el GET /:pid trae el producto con el id proporcionado
// ***-> el POST / agrega un nuevo producto con campos 
// ***->-> id auto generado sin repeticion
// ***->-> title - description - code - price - status (true por defecto) - stock - category (todos obligatorios)
// ->-> thumbnails auto generado sin repeticion (no obligatorio)
// ***-> el PUT /:pid toma un producto y lo actualiza por los campos enviados desde el body (mantener el mismo id)
// -> ruta DELETE /:pid elimina el producto con el pid indicado
// ***el carrito en /api/carts/ configurar
// ***-> raiz POST / crea un nuevo carrito con
// ***->-> id autoincremental sin duplicar y autogenerado
// ***->-> products array que contenga objetos que representen cada producto
// ***->-> GET /:cid lista los productos del carrito seleccionado
// ->-> POST /:cid/product/:pid agrega a products del carrito agregandose como objeto:
// ->->-> product solo contiene el id del producto
// ->->-> quantity contiene la cantidad del producto (por el momento se agregara de uno en uno)(si ya existe el producto incrementar quantity del producto)

// ***info se almacena en productos.json y carrito.json
// ***mediante Postman o preferencia
// ***subir a github sin node_modules
// ***no olvider app.use(express.json())
// CONSULTAR PORQUE REEMPLAZA AL CREAR NNUEVO CARRITO!!!!!!!