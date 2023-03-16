const nodemailer = require('nodemailer')
const config = require('../configs/configGmail.json').dev
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss) :label' })

exports.sendMail = (emailContent) => {
  try {
    const emailTransport = nodemailer.createTransport({
      service: config.service,
      auth: {
        user: config.user,
        pass: config.password
      }
    })
    
    const email = {
      from: config.sender,
      to: emailContent.to,
      subject: emailContent.subject,
      text: emailContent.body
    }
    
    emailTransport.sendMail(email)
    console.log(`Email sent successfully to ${emailContent.to}`)
  } catch(err) {
    console.log(`Couldn't send the email`)
  }
}
