const db = require('../models')
const { regexEmail } = require("../utils/regex")

module.exports = async (req, res, next) => {
  try {
    const { email, password } = req.body

    // save login attempt
    const loginAttempt = await db.system_login_attempt.create({
      email: email ? email.trim() : null,
      ip: req.ip
    })

    if(!email || email.trim() === '' || !password) {
      console.log(`loginValidation: Missing parameter(s)`)
      await loginAttempt.update({ result: false, fail_method: 'missing_params' })
      return res.json({
        status: 400,
        message: `Missing parameter(s)`
      })
    }

    if (!regexEmail.test(email)) {
      console.log(`loginValidation: Invalid email format`)
      await loginAttempt.update({ result: false, fail_method: 'invalid_email' })
      return res.json({
        status: 400,
        message: 'Invalid email format'
      })
    }

    res.locals.loginAttempt = loginAttempt
    console.info(`loginValidation successful`)
    next()
  } catch(err) {
    console.error(`loginValidation`)
    console.error(err.message)
    return res.json({
      status: 500,
      message: `Server Error`
    })
  }
}
