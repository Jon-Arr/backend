const express = require('express')
const router = express.Router()
const userDao = require('../daos/users.dao')
const logger = require('./logger')
const upload = require('../middlewares/multer')
const { isAuthenticated, isAdmin } = require('../middlewares/auth')
const { changeUserRole, addDocument, deleteDocument, getDocuments, uploadDocuments } = require('../daos/user.controller')

// Middleware para verificar el rol del usuario
// function checkRole(role) {
//   return (req, res, next) => {
//     if (req.user.role === role || req.user.role === 'admin') {
//       next()
//     } else {
//       logger.warn('No tienes permiso para realizar esta acción.')
//       res.status(403).send('No tienes permiso para realizar esta acción.')
//     }
//   }
// }

// Cambiar el rol de un usuario a premium o user
// router.put('/premium/:uid', checkRole('admin'), async (req, res) => {
router.put('/premium/:uid', isAuthenticated, isAdmin, changeUserRole, async (req, res) => {
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

router.post('/:uid/documents', isAuthenticated, addDocument, upload.array('documents'), uploadDocuments)
router.delete('/:uid/documents/:docId', isAuthenticated, deleteDocument)
router.get('/:uid/documents', isAuthenticated, getDocuments)

module.exports = router