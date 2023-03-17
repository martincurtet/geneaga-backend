const express = require('express')
const router = express.Router()

const { authController } = require('../controllers/authController')
const registerValidation = require('../middlewares/registerValidation')

router.post('/register', registerValidation, authController.register)

module.exports = router
