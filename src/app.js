//Imports
const productsRouter = require("../routes/products.router")
const productManager = require("./ProductManager")
const cartsRouter = require("../routes/carts.router")
const viewRouter = require("../routes/view.router")
const express = require('express')
const handlebars = require("express-handlebars")
const path = require("path")
const {Server} = require("socket.io")

const app = express()
const httpServer = app.listen(8080, () => 
  console.log(`Aplicacion corriendo en puerto 8080`)
)
const io = new Server(httpServer)

//Uso handlebars
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

//Middleware
app.use(express.json())
app.use(express.static("public"))

//Rutas
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/", viewRouter)

//Reglas
app.get("/ping", (req, res) => {
  res.send("Pong")
})

app.get('/', async (req, res) => {
  try {
    const products = await productManager.getProducts()
    res.render('home', { products })
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).send('Error interno del servidor')
  }
})

// Socket.io
io.on('connection', async (socket) => {
  console.log('Usuario conectado')
  
  socket.on('updateProducts', (products) => {
    io.emit('updateProducts', products)
  })

  const products = await productManager.getProducts()
  socket.emit('updateProducts', products)

  socket.on('addProduct', async ({ title, description, price, thumbnail, code, stock }) => {
    const newProduct = { title, description, price, thumbnail, code, stock }
    const updatedProducts = await productManager.addProduct(title, description, price, thumbnail, code, stock)
    io.emit('updateProducts', updatedProducts)
  })

  socket.on('deleteProduct', async (productId) => {
    const updatedProducts = await productManager.deleteProduct(productId)
    io.emit('updateProducts', updatedProducts)
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado')
  });
});