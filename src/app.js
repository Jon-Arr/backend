//Imports
const express = require('express')
const handlebars = require("express-handlebars")
const path = require("path")
const { Server } = require("socket.io")
const mongoose = require('mongoose')
const productManager = require("./daos/ProductManager")
const productsRouter = require("./routes/products.router")
const cartsRouter = require("./routes/carts.router")
const cartsDbRouter = require("./routes/cartdb.router")
const viewRouter = require("./routes/view.router")
const productDbRouter = require("./routes/productDb.router")
const productsDao = require("./daos/products.dao")
const messageRouter = require('./routes/message.router')
const Message = require('./daos/models/chat.model')
const MongoStore = require('connect-mongo')
// const indexRouter = require('./routes/index')
const authRouter = require('./routes/auth.router')
const session = require('express-session')
const FileStorage = require('session-file-store')
const cookieParser = require('cookie')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt
const User = require('./daos/models/usermodel')
const config = require('../config')
const nodemailer = require('nodemailer')
const mockingMiddleware = require('./routes/mockingModule')
const { errorHandler, errorMessages } = require('./routes/errorHandlers')

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: jwtSecret
}

const jwt = require('jsonwebtoken');
const passport = require('passport');
const jwtSecret = 'jwt_secret'

exports.login = (req, res, next) => {
    passport.authenticate('local', { session: false }, (err, user) => {
        if (err || !user) {
            return res.status(400).json({ message: 'Error en la autenticación', user })
        }
        req.login(user, { session: false }, (err) => {
            if (err) {
                res.send(err)
            }
            const token = jwt.sign({ id: user.id }, jwtSecret)
            return res.json({ user, token })
        });
    })(req, res, next)
}

passport.use(new LocalStrategy({
  usernameField: 'email',
  passwordField: 'password'
}, async (email, password, done) => {
  try {
      const user = await User.findOne({ email })
      if (!user) {
          return done(null, false, { message: 'Usuario no encontrado' })
      }
      const isValidPassword = await user.isValidPassword(password);
      if (!isValidPassword) {
          return done(null, false, { message: 'Contraseña incorrecta' })
      }
      return done(null, user)
  } catch (error) {
      return done(error)
  }
}))

passport.use(new JwtStrategy({
  secretOrKey: 'secret_key',
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
}, async (payload, done) => {
  try {
      const user = await User.findById(payload.sub)
      if (!user) {
          return done(null, false)
      }
      return done(null, user)
  } catch (error) {
      return done(error)
  }
}))

passport.serializeUser((user, done) => {
  done(null, user.id)
})

passport.deserializeUser(async (id, done) => {
  try {
      const user = await User.findById(id);
      done(null, user)
  } catch (error) {
      done(error)
  }
})

const app = express()
const httpServer = app.listen(8080, () =>
  console.log(`Aplicacion corriendo en puerto 8080`)
)
const io = new Server(httpServer)
const fileStorage = FileStorage(session)

// app.use(cookieParser())
app.use(session({
  store: MongoStore.create({
    mongoUrl:"mongodb+srv://jaarriazae:axb5a2RQIMvydRDb@ecommerce.jzgqf9a.mongodb.net/?retryWrites=true&w=majority",
    mongoOptions:{useNewUrlParser:true,useUnifiedTopology:true},
    ttl:100,
  }),
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}))

//Mongoose
mongoose.connect("mongodb+srv://jaarriazae:axb5a2RQIMvydRDb@ecommerce.jzgqf9a.mongodb.net/?retryWrites=true&w=majority")
// mongoose.connect("mongodb://localhost:27017")

//Uso handlebars vistas
app.engine("handlebars", handlebars.engine())
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'handlebars')

//Middleware
app.use(express.json())
app.use(express.static("public"))
exports.verifyToken = (req, res, next) => {
  passport.authenticate('jwt-cookie', { session: false }, (err, user) => {
      if (err || !user) {
          return res.status(401).json({ message: 'Error en la autenticación' })
      }
      req.user = user
      next();
  })(req, res, next)
}
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Algo salió mal en el servidor')
})
app.use(errorHandler)

//Rutas
app.use("/api/products", productsRouter)
app.use("/api/productsDb", productDbRouter)
app.use("/api/carts", cartsRouter)
app.use("/api/cartsdb", cartsDbRouter)
app.use("/realTimeProducts", viewRouter)
app.use('/messages', messageRouter)
// app.use('/', indexRouter)
app.use('/api/sessions', authRouter)
app.use('/mockingMiddleware')

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

app.get('/mail', async(req,res) =>{
  let result = await transport.sendMail({
    from:'Correo de prueba <jaarriaza.e@gmail.com>',
    to:'jaarriaza.e@gmail.com',
    subject:'Correo de prueba',
    html:`<div>
          <h1>Testing</h1>
          </div>`,
    attachments:[{
      filename: '404.jpg',
      path:__dirname+'./img/404.jpg',
      cid:'notfound'
  }]
  })
  res.send({status:"success", result:"Email Sent"})
})
const transport = nodemailer.createTransport({
  service: 'gmail',
  port:587,
  auth:{
    user:'jaarriaza.e@gmail.com',
    pass:'pass'
  }
})

app.get('/api/products/:id', (req, res, next) => {
  const productId = req.params.id
  // Simulación de un error si el producto no se encuentra
  const product = null
  if (!product) {
    const err = new Error()
    err.status = 404
    err.code = 'PRODUCT_NOT_FOUND'
    next(err)
  } else {
    res.json(product)
  }
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

  //Chat
  socket.on("chat message", async (msg) => {
    io.emit("chat message", msg)

    try {
      const message = new Message({
        users: msg.users,
        message: msg.message
      })
      await message.save()
    } catch (error) {
      console.error('Error saving message:', error)
    }
  })

  socket.on('disconnect', () => {
    console.log('Usuario desconectado')
  })
})