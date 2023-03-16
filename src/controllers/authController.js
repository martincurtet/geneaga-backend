const bcrypt = require('bcrypt')
const db = require('../models')

exports.authController = {
  async register(req, res) {
    try {
      const { email, username, password, languageCode, emailPreferences } = req.body
      const salt = await bcrypt.genSalt(10)
      const bcryptPassword = await bcrypt.hash(password, salt)

      const [user, created] = await db.user.findOrCreate({
        where: { email: email },
        defaults: {
          username: username,
          active: false
        }
      })

      if (created) {
        console.log(`User ${email} registered`)
        return res.json({
          status: 200,
          message: `User registered`,
          data: {
            user: { id: user.id, email: user.email, username: user.username }
          }
        })
      } else {
        console.log(`User ${email} already exists`)
        return res.json({
          status: 409,
          message: `User already exists`
        })
      }
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
