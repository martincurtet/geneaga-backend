const express = require('express')
const router = express.Router()

const { authController } = require('../controllers/authController')
const registerValidation = require('../middlewares/registerValidation')

router.post('/register', registerValidation, authController.register)
router.get('/activate-account', authController.activateAccount)

module.exports = router
