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
