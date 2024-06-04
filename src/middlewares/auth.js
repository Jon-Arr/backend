const jwt = require('jsonwebtoken')
const User = require('../daos/models/usermodel')

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

module.exports = { isAuthenticated, isAdmin}