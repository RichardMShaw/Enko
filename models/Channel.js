const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class Channel extends Model { }

Channel.init({
  discordId: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  botChannel: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  },
  blacklist: {
    type: DataTypes.BOOLEAN,
    allowNull: false
  }
}, { sequelize, modelName: 'channel' })

Channel.checkoutGuild = async (guild) => {
  try {
    let channels = await guild.channels.cache
    await channels.forEach(async ({ id, name }) => {
      name = name.toLowerCase()
      await Channel.findOrCreate({ where: { name: name }, defaults: { discordId: id, name: name, botChannel: false, blacklist: false } })
    })
  } catch (err) {
    console.log(err)
  }
}


module.exports = Channel
