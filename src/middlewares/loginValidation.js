const { regexEmail } = require("../utils/regex")

module.exports = (req, res, next) => {
  try {
    const { email, password } = req.body

    if(!email || email.trim() === '' || !password) {
      console.log(`loginValidation: Missing parameter(s)`)
      return res.json({
        status: 400,
        message: `Missing parameter(s)`
      })
    }

    if (!regexEmail.test(email)) {
      console.log(`loginValidation: Invalid email format`)
      return res.json({
        status: 400,
        message: 'Invalid email format'
      })
    }

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
