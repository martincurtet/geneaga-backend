const express = require('express')
const cors = require('cors')
const db = require('./models')
require('dotenv').config()
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss) :label' })

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

try {
  db.sequelize.sync({ alter: true })
  console.log(`Database synchronization successful`)
} catch(err) {
  console.log(`Database cannot synchronize`)
  console.error(err.message)
}

app.use('/auth', require('./routers/authRouter'))

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
