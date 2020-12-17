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
  members.forEach(async (guildMember) => {
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

User.prototype.updateUser = async (guildMember) => {
  let self = this.dataValues
  let update = false

  let tag = `${guildMember.user.username}#${guildMember.user.discriminator}`
  if (self.tag !== tag) {
    self.tag = tag
  }

  if (self.displayName !== guildMember.nickname) {
    self.displayName = (guildMember.nickname) ? guildMember.nickname : guildMember.user.username
  }

  try {
    await User.update(self, { where: { discordId: self.discordId } })
  } catch (err) { console.log(err) }

}

User.prototype.changePoints = function (val) {
  let self = this.dataValues
  console.log(dataValues)
  self.points += val
  try {
    await User.update(self, { where: { discordId: self.discordId } })
  } catch (err) { console.log(err) }
}

User.prototype.givePoints = (val, guildMember, channel) => {
  try {

    let self = this.dataValues
    let user = await User.checkoutGuildMember(guildMember)
    user = user.dataValues

    if (val < 0) {
      val *= -1
    }

    if (self.points - val < 0) {
      await channel.send(`Not Enough Points!`)
      return;
    }

    self.points -= val
    user.points += val

    await User.update(self, { where: { discordId: self.discordId } })
    await User.update(user, { where: { discordId: user.discordId } })
    let s = (val > 1) ? 's' : ''
    await channel.send(
      `${this.displayName} gave ${val} point${s} to ${user.displayName}.\n`
      + `${this.displayName}: ${this.points}\n`
      + `${user.displayName}: ${user.points}`)
  } catch (err) { console.log(err) }
}

module.exports = User
