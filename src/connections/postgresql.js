const Sequelize = require('sequelize')
const config = require('../configs/configPostgres.json').dev
require('console-stamp')(console, { format: ':date(yyyy/mm/dd HH:MM:ss) :label' })

const sequelize = new Sequelize(
  config.database,
  config.username,
  config.password,
  {
    host: config.host,
    port: config.port,
    dialect: config.dialect,
    logging: config.logging
  }
)

try {
  sequelize.authenticate()
  console.log(`Database connection successful`)
} catch(err) {
  console.log(`Database connection error`)
  console.error(err.message)
}

module.exports = sequelize
