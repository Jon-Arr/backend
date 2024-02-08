const express = require('express')
const router = express.Router()
const path = require('path')

router.get('/realTimeProducts', (req, res) => {
    res.render('realTimeProducts')
})

module.exports = router