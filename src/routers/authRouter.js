const express = require('express')
const router = express.Router()

const { authController } = require('../controllers/authController')
const loginValidation = require('../middlewares/loginValidation')
const registerValidation = require('../middlewares/registerValidation')

router.post('/register', registerValidation, authController.register)
router.get('/activate-account', authController.activateAccount)
router.post('/login', loginValidation, authController.login)
router.post('/logout', authController.logout)

module.exports = router
