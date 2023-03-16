const express = require('express')
const cors = require('cors')
require('dotenv').config()
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss) :label' })

const PORT = process.env.PORT

const app = express()
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors())

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
