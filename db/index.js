const { enko_db } = require('../keys')
const Sequelize = require('sequelize')

const sequelize = new Sequelize(process.env.JAWSDB_URL || enko_db)

module.exports = sequelize
