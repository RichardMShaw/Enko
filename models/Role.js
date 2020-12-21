const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Role extends Model { }

Role.init({
  discordId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  conflicts: {
    type: DataTypes.STRING
  }
}, { sequelize, modelName: 'role' })

Role.checkoutGuild = async (guild) => {
  try {
    let roles = await guild.roles.fetch()
    await roles.cache.forEach(async ({ id, name }) => {
      name = name.toLowerCase()
      await Role.findOrCreate({ where: { name: name }, defaults: { discordId: id, name: name } })
    })
  } catch (err) {
    console.log(err)
  }
}

module.exports = Role
