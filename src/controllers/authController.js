const bcrypt = require('bcrypt')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const db = require('../models')
const { sendMail } = require('../utils/emailService')
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
        return { user, token }
      })

      sendMail({
        to: result.user.email,
        subject: `Verify your account`,
        body: `Hi ${result.user.username},

        Thank you for creating your Geneaga account! To complete your setup, please click on this link below:
      
        localhost:8080/auth/activate-account?token=${result.token}
      
        Once you've clicked this link, your account will be activated and you will be able to log in.
      
        If you didn't register on our website, please disregard this email.
      
        Thanks,
      
        \n Geneaga
        `
      })

      console.info(`/auth/register: User ${result.user.email} registered`)
      return res.json({
        status: 201,
        message: `User registered`,
        data: {
          user: { id: result.user.id, email: result.user.email, username: result.user.username }
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
  },

  async activateAccount(req, res) {
    try {
      const token = req.query.token

      if (!token || token.trim() === '') {
        console.error(`/auth/activate-account: Missing parameter`)
        return res.json({
          status: 400,
          message: `Missing parameter`
        })
      }

      const dbToken = await db.user_activation_token.findOne({ where: { token: token }})
      if (dbToken === null) {
        console.error(`/auth/activate-account: Token not found`)
        return res.json({
          status: 404,
          message: `Token not found`
        })
      } else {
        if (dbToken.dataValues.used) {
          console.error(`/auth/activate-account: Token already used`)
          return res.json({
            status: 409,
            message: `Token already used`
          })
        }
      }

      const { user_id } = await jwt.verify(token, process.env.JWT_ACTIVATION)

      await db.sequelize.transaction(async (t) => {
        await db.user.update({ active: true }, {
          where: { id: user_id }
        }, { transaction: t })
        await db.user_activation_token.update({ used: db.sequelize.fn('NOW') }, {
          where: { token: token }
        }, { transaction: t })
      })

      console.log(`/auth/activate-account: Account ${user_id} activated`)
      return res.json({
        status: 201,
        message: `Account activated`
      })
    } catch(err) {
      if (err.name === 'JsonWebTokenError') {
        console.error(`/auth/activate-account: Invalid token`)
        return res.json({
          status: 401,
          message: `Invalid token`
        })
      } else if (err.name === 'TokenExpiredError') {
        console.error(`/auth/activate-account: Token expired`)
        return res.json({
          status: 401,
          message: `Token expired`
        })
      } else {
        console.error(`/auth/activate-account`)
        console.error(err)
        return res.json({
          status: 500,
          message: `Server error`
        })
      }
    }
  },

  async login(req, res) {
    try {
      const { email, password } = req.body
      const loginAttempt = res.locals.loginAttempt

      const user = await db.user.findOne({ where: { email: email }})
      if (user === null) {
        console.error(`/auth/login: User not found`)
        await loginAttempt.update({ result: false, fail_method: 'user_not_found' })
        return res.json({
          status: 404,
          message: `User not found`
        })
      }

      if (!user.active) {
        console.error(`/auth/login: User not active`)
        await loginAttempt.update({ result: false, fail_method: 'user_not_active' })
        return res.json({
          status: 404,
          message: `User not active`
        })
      }

      const savedPw = await db.user_password.findOne({ where: { user_id: user.id }})
      const matchPw = await bcrypt.compare(password, savedPw.password)
      if (!matchPw) {
        console.error(`/auth/login: Wrong password`)
        await loginAttempt.update({ result: false, fail_method: 'wrong_password' })
        return res.json({
          status: 401,
          message: `Wrong email or password`
        })
      }

      // check if session already active

      const currentTime = new Date()
      const session = await db.user_session.create({
        user_id: user.id,
        session_id: crypto.randomBytes(20).toString('hex'),
        expires: new Date(currentTime.getTime() + parseInt(process.env.SESSION_TIMEOUT)),
        max_expires: new Date(currentTime.getTime() + parseInt(process.env.SESSION_MAX_AGE)),
        ip: req.ip
      })
      await loginAttempt.update({ result: true, session_id: session.session_id })

      // update last login
      await user.update({ last_login: Date.now() })

      return res.json({
        status: 201,
        message: `User logged in`,
        data: {
          sessionId: session.session_id
        }
      })
    } catch(err) {
      console.error(`/auth/login`)
      console.error(err.message)
      return res.json({
        status: 500,
        message: `Server error`
      })
    }
  },

  async logout(req, res) {
    try {
      const { user_id } = req.body
      db.user_session.update({
        expired: Date.now(),
        expired_method: 'manual'
      }, {
        where: { user_id: user_id }
      })
      console.log(`/auth/logout: successful`)
      return res.json({
        status: 200,
        message: `Logout successful`
      })
    } catch(err) {
      console.error(`/auth/logout`)
      console.error(err.message)
      return res.json({
        status: 500,
        message: `Server error`
      })
    }
  }
}
