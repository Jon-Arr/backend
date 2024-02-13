const express = require('express')
const router = express.Router()
const Message = require('../daos/models/chat.model')

// Ruta para obtener todos los mensajes
router.get('/', async (req, res) => {
    try {
        const messages = await Message.find()
        res.json(messages)
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
})

// Ruta para agregar un nuevo mensaje
router.post('/', async (req, res) => {
    const message = new Message({
        users: req.body.users,
        message: req.body.message
    })

    try {
        const newMessage = await message.save()
        res.status(201).json(newMessage)
    } catch (error) {
        res.status(400).json({ message: error.message })
    }
})

module.exports = router