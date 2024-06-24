const express = require('express')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../daos/models/user.model')
const { isAuthenticated } = require('../middlewares/auth')
const router = express.Router()
require('dotenv').config()

router.post('/register', async (req, res) => {
  const { first_name, last_name, email, age, password } = req.body

  try {
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ message: 'Usuario ya registrado' })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const newUser = new User({
      first_name,
      last_name,
      email,
      age,
      password: hashedPassword,
      role: 'user',
      documents: [],
      last_connection: null
    })

    await newUser.save()

    res.status(201).json({ message: 'Usuario registrado exitosamente' })
  } catch (error) {
    console.error('Error registrando usuario:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

router.post('/login', async (req, res) => {
  const { email, password } = req.body

  try {
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: 'Credenciales inválidas' })
    }

    const token = jwt.sign({ id: user._id, email: user.email, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' })

    user.last_connection = new Date()
    await user.save()

    res.cookie('token', token, { httpOnly: true }).json({ message: 'Inicio de sesión exitoso', token })
  } catch (error) {
    console.error('Error en inicio de sesión:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

// Logout de usuario
router.post('/logout', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id)
    user.last_connection = new Date()
    await user.save()

    res.clearCookie('token').json({ message: 'Cierre de sesión exitoso' })
  } catch (error) {
    console.error('Error en cierre de sesión:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

router.get('/current', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password')
    res.json(user)
  } catch (error) {
    console.error('Error obteniendo usuario actual:', error)
    res.status(500).json({ message: 'Error interno del servidor' })
  }
})

module.exports = router

// const express = require('express')
// const router = express.Router()
// const { loginUser, logoutUser } = require('../daos/authController')

// router.post('/register', authController.register)
// router.post('/login', loginUser)
// router.post('/logout', logoutUser)
// router.get('/current', getCurrentUser)

// module.exports = router