const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Role extends Model { }

Role.init({
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conflicts: {
    type: DataTypes.TEXT
  }
}, { sequelize, modelName: 'role' })

Role.checkoutGuild = async (guild) => {
  try {
    let roles = await guild.roles.fetch()
    await roles.cache.forEach(async ({ name }) => {
      await Role.findOrCreate({ where: { name: name }, defaults: { name: name } })
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = Role
