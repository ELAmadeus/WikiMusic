const express = require('express')
const {registerUser, login, logout} = require('../seguridad/authService')
const { authenticateJWT } = require('../seguridad/auth')


const router = express.Router()

router.post('/register', registerUser)
router.post('/login', login)
router.post('/logout', authenticateJWT, logout)

module.exports = router

