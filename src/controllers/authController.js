const bcrypt = require('bcrypt')
const db = require('../models')

exports.authController = {
  async register(req, res) {
    try {
      const { email, username, password, languageCode, emailPreferences } = req.body

      const existingUser = await db.user.findOne({ where: { email: email }})
      if (existingUser) {
        console.error(`User already exists`)
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
          preferences: JSON.stringify(emailPreferences)
        }, { transaction: t })
        return user
      })

      console.log(`User ${email} registered`)
      return res.json({
        status: 200,
        message: `User registered`,
        data: {
          user: { id: result.id, email: result.email, username: result.username }
        }
      })
      
    } catch(err) {
      console.log(`Server error on /auth/register route`)
      console.log(err)
      return res.json({
        status: 500,
        message: `Server error`
      })
    }
  }
}
