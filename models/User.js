const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class User extends Model { }

User.init({
  discordId: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  tag: {
    type: DataTypes.STRING,
    allowNull: false
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  points: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  isMod: {
    type: DataTypes.BOOLEAN
  }

}, { sequelize, modelName: 'user' })

User.checkoutGuild = async (guild) => {
  let members = await guild.members.fetch()
  await members.forEach(async (guildMember) => {
    let user = await User.checkoutGuildMember(guildMember)
    await user.updateUser(guildMember)
  })
}


User.checkoutGuildMember = async (guildMember) => {
  let { id, discriminator, username } = guildMember.user
  return await User.findOrCreate({
    where: { discordId: id },
    defaults: {
      discordId: id,
      tag: `${username}#${discriminator}`,
      displayName: username,
      points: 0,
      isMod: false
    }
  }).then(user => { return user[0] })
    .catch(err => console.log(err))
}

User.prototype.updateUser = async function (guildMember) {
  let self = this.dataValues
  let update = false

  let tag = `${guildMember.user.username}#${guildMember.user.discriminator}`
  if (self.tag !== tag) {
    self.tag = tag
    update = true
  }

  if (self.displayName !== guildMember.nickname && self.displayName !== guildMember.user.username) {
    self.displayName = (guildMember.nickname) ? guildMember.nickname : guildMember.user.username
    update = true
  }

  try {
    if (update) {
      await User.update(self, { where: { discordId: self.discordId } })
    }
  } catch (err) { console.log(err) }

}

User.prototype.changePoints = async function (val) {
  let self = await User.findOne({ where: { discordId: this.dataValues.discordId } })
  this.dataValues = self.dataValues
  this.dataValues.points += val
  try {
    await User.update(this.dataValues, { where: { discordId: this.dataValues.discordId } })
  } catch (err) { console.log(err) }
}

module.exports = User
