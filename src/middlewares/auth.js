const jwt = require('jsonwebtoken')
const User = require('../daos/models/user.model')

const isAuthenticated = (req, res, next) => {
  const token = req.header('Authorization').replace('Bearer ', '')

  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY)
    req.user = decoded
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token is not valid' })
  }
}

const isAdmin = async (req, res, next) => {
  const user = await User.findById(req.user.id)
  if (user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied' })
  }
  next()
}

const isOwnerOrAdmin = async (req, res, next) => {
  const { productId } = req.params
  const userId = req.user._id

  try {
    const product = await Product.findById(productId)

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' })
    }

    if (req.user.role === 'admin' || product.owner === req.user.email) {
      return next()
    }

    return res.status(403).json({ message: 'Acceso denegado. No tienes permiso para eliminar este producto.' })
  } catch (error) {
    console.error('Error en la verificación de permisos:', error)
    res.status(500).json({ message: 'Error interno del servidor', error })
  }
}

module.exports = { isAuthenticated, isAdmin, isOwnerOrAdmin}