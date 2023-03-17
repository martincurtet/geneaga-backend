const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const db = require('../models')
require('dotenv').config()

exports.authController = {
  async register(req, res) {
    try {
      const { email, username, password, languageCode, emailPreferences } = req.body

      const existingUser = await db.user.findOne({ where: { email: email }})
      if (existingUser) {
        console.error(`/auth/register: User already exists`)
        return res.json({
          status: 409,
          message: `User already exists`
        })
      }

      const result = await db.sequelize.transaction(async (t) => {
        const user = await db.user.create({
          email: email,
          username: username,
          active: false
        }, { transaction: t })
        const salt = await bcrypt.genSalt(10)
        const bcryptPassword = await bcrypt.hash(password, salt)
        await db.user_password.create({
          user_id: user.id,
          password: bcryptPassword
        }, { transaction: t })
        await db.user_preference.create({
          user_id: user.id,
          language: languageCode,
          preferences: JSON.stringify(emailPreferences)
        }, { transaction: t })
        const token = jwt.sign(
          { user_id: user.id },
          process.env.JWT_ACTIVATION,
          { expiresIn: process.env.JWT_ACTIVATION_EXPIRE }
        )
        await db.user_activation_token.create({
          user_id: user.id,
          token: token
        })
        return user
      })

      console.info(`/auth/register: User ${email} registered`)
      return res.json({
        status: 200,
        message: `User registered`,
        data: {
          user: { id: result.id, email: result.email, username: result.username }
        }
      })
    } catch(err) {
      console.error(`/auth/register`)
      console.error(err)
      return res.json({
        status: 500,
        message: `Server error`
      })
    }
  }
}
