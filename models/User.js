const { Model, DataTypes } = require('sequelize')
const sequelize = require('../db')

class User extends Model { }

User.init({
  discordId: {
    type: DataTypes.STRING,
    allowNull: false
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
  }

}, { sequelize, modelName: 'user' })

User.prototype.change_points = function (val) {
  let { dataValues } = this
  console.log(dataValues)
  dataValues.points += val
  User.update(dataValues, { where: { discordId: dataValues.discordId } })
}

User.give_points = (val, user, channel) => {
  if (val < 0) {
    val *= -1
  }

  if (this.points - val < 0) {
    channel.send(`Not Enough Points!`)
    return;
  }

  this.points -= val
  user.points += val

  User.update(this, { where: { discordId: this.discordId } })
    .then(() => {
      User.update(user, { where: { discordId: user.discordId } })
    })
    .then(() => {
      channel.send(`${this.displayName} sent ${val} points to ${user.displayName}.\n`
        + `${this.displayName}: ${this.points}\n`
        + `${user.displayName}: ${user.points}`)
    })

}

module.exports = User
