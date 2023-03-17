const regexEmail = /\S+@\S+\.\S+/
const regexUsername = /^[a-zA-Z0-9._-]+$/
const regexPassword = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[a-zA-Z]).{8,}$/
const regexLanguageCode = /^[a-zA-Z]{2}(-[a-zA-Z]{2})?$/

module.exports = {
  regexEmail,
  regexUsername,
  regexPassword,
  regexLanguageCode
}
