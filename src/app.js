//Imports
const express = require('express')
const handlebars = require("express-handlebars")
const path = require("path")
const {Server} = require("socket.io")
const mongoose = require('mongoose')
const productManager = require("./daos/ProductManager")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const viewRouter = require("./routes/view.router")
const productDbRouter = require("./routes/productDb.router")
const messageRouter = require('./routes/message.router')
const productsDao = require("./daos/products.dao")


const app = express()
const httpServer = app.listen(8080, () => 
  console.log(`Aplicacion corriendo en puerto 8080`)
)
const io = new Server(httpServer)

//Mongoose
mongoose.connect("mongodb+srv://jaarriazae:axb5a2RQIMvydRDb@ecommerce.jzgqf9a.mongodb.net/?retryWrites=true&w=majority")

//Uso handlebars vistas
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

//Middleware
app.use(express.json())
app.use(express.static("public"))

//Rutas
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)
app.use("/realTimeProducts", viewRouter)
app.use("/api/productDb", productDbRouter)
app.use('/messages', messageRouter)

//Reglas

app.get('/', async (req, res) => {
  try {
    // const products = await productManager.getProducts()
    const products = await productsDao.getAllProducts()
    res.render('home', { products })
  } catch (error) {
    console.error('Error obteniendo productos:', error)
    res.status(500).send('Error interno del servidor')
  }
})

app.get('/chat', async (req, res) => {
  res.render('chat');
})

app.get("/ping", (req, res) => {
  res.send("Pong")
})

app.use((req, res, next) => {
  res.render("404")
})

// Socket.io
io.on('connection', async (socket) => {
  console.log('Usuario conectado')
  
  //product manager actualizable
  socket.on('updateProducts', (products) => {
    io.emit('updateProducts', products)
  })

  const products = await productsDao.getAllProducts()
  socket.emit('updateProducts', products)

  socket.on('addProduct', async ({ title, description, price, thumbnail, code, stock }) => {
    const newProduct = { title, description, price, thumbnail, code, stock }
    const updatedProducts = await productsDao.postProduct(title, description, price, thumbnail, code, stock)
    io.emit('updateProducts', updatedProducts)
  })

  socket.on('deleteProduct', async (productId) => {
    const updatedProducts = await productsDao.delProduct(productId)
    io.emit('updateProducts', updatedProducts)
  })
  //fin product manager

  socket.on("chat message", (msg) =>{
    io.emit("chat message", msg)
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado')
  });
});