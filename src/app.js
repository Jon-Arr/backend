//Imports
const productsRouter = require("../routes/products.router")
const cartsRouter = require("../routes/carts.router")
const viewsRouter = require("../routes/view.router")
const express = require('express')
const handlebars = require("express-handlebars")
const path = require("path")
const {Server} = require("socket.io")

const app = express()
const httpServer = app.listen(8080, () => 
  console.log(`Aplicacion corriendo en puerto 8080`)
)
const socketServer = new Server(httpServer)

//Uso handlebars
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, '/views'))
app.set('view engine', 'handlebars')

//Middleware
app.use(express.json())
app.use(express.static("public"))

//Rutas
app.use("/api/products", productsRouter)
app.use("/api/carts", cartsRouter)

//Reglas
app.get("/ping", (req, res) => {
  res.send("Pong")
})

app.get('/', (req, res) => {
  viewsRouter
})

let products = []

socketServer.on("connection", (socket) => {
  console.log("Usuario conectado");

  socket.on("addProduct", (product) => {
    productsRouter.getProducts().push(product);
    io.emit("updateProducts", productsRouter.getProducts());
  });

  socket.on("deleteProduct", (productId) => {
    const index = productsRouter.getProducts().findIndex((product) => product.id === productId)
    if (index !== -1) {
      productsRouter.getProducts().splice(index, 1)
      io.emit("updateProducts", productsRouter.getProducts())
    }
    });

  socket.on("disconnect", () => {
    console.log("Usuario desconectado")
  })
})