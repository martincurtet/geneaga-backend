const Ajv = require('ajv')
const ajv = new Ajv()

const { regexEmail, regexUsername, regexPassword, regexLanguageCode} = require('../utils/regex')

module.exports = (req, res, next) => {
  try {
    const { email, username, password, languageCode, emailPreferences } = req.body

    if (!email || !username || !password || email.trim() === '' || username.trim() === '' || password.trim() === '') {
      console.error(`registerValidation: Missing parameter(s)`)
      return res.json({
        status: 400,
        message: `Missing parameter(s)`
      })
    }

    if (!regexEmail.test(email)) {
      console.log(`registerValidation: Invalid email format`)
      return res.json({
        status: 400,
        message: 'Invalid email format'
      })
    }

    if (!regexUsername.test(username)) {
      console.log(`registerValidation: Username requirements not met`)
      return res.json({
        status: 400,
        message: 'Username requirements not met'
      })
    }

    if (!regexPassword.test(password)) {
      console.log(`registerValidation: Password requirements not met`)
      return res.json({
        status: 400,
        message: 'Password requirements not met'
      })
    }

    if (!languageCode || languageCode.trim() === '' || !regexLanguageCode.test(languageCode)) {
      console.log(`registerValidation: languageCode error`)
      req.body.languageCode = 'en'
    }

    const emailPreferencesSchema = {
      type: 'object',
      properties: {
        emailSystem: { type: 'boolean' },
        emailNews: { type: 'boolean' }
      },
      required: ['emailSystem', 'emailNews']
    }
    const validator = ajv.compile(emailPreferencesSchema)
    if (!emailPreferences || Object.keys(emailPreferences).length === 0 || !validator(emailPreferences)) {
      console.log(`registerValidation: emailPreferences error`)
      req.body.emailPreferences = { "emailSystem": true, "emailNews": false }
    }

    console.info(`registerValidation successful`)
    next()
  } catch(err) {
    console.error(`registerValidation`)
    console.error(err.message)
    return res.json({
      status: 500,
      message: `Server Error`
    })
  }
}
