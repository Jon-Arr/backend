const express = require('express');
const router = express.Router();
const userDao = require('../daos/users.dao');
const logger = require('./logger');

// Middleware para verificar el rol del usuario
function checkRole(role) {
  return (req, res, next) => {
    if (req.user.role === role || req.user.role === 'admin') {
      next()
    } else {
      logger.warn('No tienes permiso para realizar esta acción.')
      res.status(403).send('No tienes permiso para realizar esta acción.')
    }
  }
}

// Cambiar el rol de un usuario a premium o user
router.put('/premium/:uid', checkRole('admin'), async (req, res) => {
  try {
    const uid = req.params.uid
    const user = await userDao.getUserById(uid)

    if (!user) {
      logger.warn('Usuario no encontrado.')
      return res.status(404).send('Usuario no encontrado.')
    }

    const newRole = user.role === 'user' ? 'premium' : 'user'
    const updatedUser = await userDao.updateUserRole(uid, newRole)
    
    logger.info(`Rol del usuario ${updatedUser.email} cambiado a ${newRole}.`)
    res.json(updatedUser)
  } catch (error) {
    logger.error('Error al cambiar el rol del usuario:', error)
    res.status(500).send('Error al cambiar el rol del usuario.')
  }
})

module.exports = router