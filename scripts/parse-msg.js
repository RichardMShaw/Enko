const client = require('./global/client');
const { User, Role } = require('../models')
const { serverId } = require('../keys')

const role = async (author, content, channel) => {
  if (content.length < 2) {
    await channel.send(`If you're going to ask for a role you need to tell me which one.`)
    return
  }

  let role = await Role.findOne({ where: { name: content[1] } })

  if (!role) {
    await channel.send(`Sorry, but the ${content[2]} role doesn't seem to exist`)
    return
  }

  let guild = await client.guilds.fetch(serverId)
  let guildMember = await guild.members.fetch(author.id)

  let roles = Array.from(guildMember.roles.cache.keys())
  let conflicts = await Role.findAll({ where: { conflicts: role.getDataValue('conflicts') } })

  let rolesLen = roles.length
  console.log(roles)
  let conflictsLen = conflicts.length

  for (let i = 0; i < rolesLen; i++) {
    for (let j = 0; j < conflictsLen; j++) {
      if (roles[i] === conflicts[j].getDataValue('discordId')) {
        await guildMember.roles.remove(roles[i])
        i = rolesLen
        j = conflictsLen
      }
    }
  }

  await guildMember.roles.add(role.getDataValue('discordId'))
  await channel.send(`There. You've been given the ${role.getDataValue('name')} role.`)
}

const points = async (author, content, channel) => {
  try {
    let user = await User.findOne({ where: { discordId: author.id } })
    await channel.send(
      `This is how many points you have:\n`
      + `\`\`\``
      + `${user.getDataValue('displayName')}: ${user.getDataValue('points')}`
      + `\`\`\``)
  } catch (err) {
    console.log(err)
  }
}

const gift = async (author, content, channel) => {
  try {

    if (content.length < 2) {
      await channel.send('Reward what?')
      return
    }

    let val = parseInt(content[2])
    if (isNaN(val)) {
      await channel.send(`You need to give a number.`)
      return
    }

    if (val < 0) {
      val *= -1
    } else if (val === 0) {
      await channel.send(`You're giving nothing...?`)
      return
    }

    let gifter = await User.findOne({ where: { discordId: author.id } })

    if (gifter.getDataValue('points') - val < 0) {
      await channel.send(`You don't have enough points to give!`)
      return
    }

    let id = content[1].replace('<@!', '').replace('>', '')

    if (author.id === id) {
      await channel.send(`You're giving yourself a gift? Okay then.`)
      return
    }

    let receiver = await User.findOne({ where: { discordId: id } })

    if (!receiver) {
      await channel.send(`That person doesn't exist. Did you write their name right?`)
      return
    }

    let s = (val > 1) ? 's' : ''

    await gifter.changePoints(-val)
    await receiver.changePoints(val)

    await channel.send(
      `There! ${gifter.getDataValue('displayName')} gave ${val} point${s} to ${receiver.getDataValue('displayName')}!\n`
      + '\`\`\`'
      + `${gifter.getDataValue('displayName')}: ${gifter.getDataValue('points')}\n`
      + `${receiver.getDataValue('displayName')}: ${receiver.getDataValue('points')}`
      + '\`\`\`')
  } catch (err) {
    console.log(err)
  }
}

const reward = async (author, content, channel) => {
  try {
    if (content.length < 2) {
      await channel.send('Reward what?')
      return
    }

    let val = parseInt(content[2])
    if (isNaN(val)) {
      await channel.send(`You need to reward a number.`)
      return
    }
    if (val < 0) {
      val *= -1
    } else if (val === 0) {
      await channel.send(`You're rewarding nothing...?`)
      return
    }

    let id = content[1].replace('<@!', '').replace('>', '')
    let user = await User.findOne({ where: { discordId: id } })

    if (!user) {
      await channel.send(`That member doesn't exist. Did you write their name right?`)
      return
    }

    let s = (val > 1) ? 's' : ''
    await user.changePoints(val)
    await channel.send(
      `Bang! ${val} point${s} just for you!\n`
      + '\`\`\`'
      + `${user.getDataValue('displayName')}: ${user.getDataValue('points')}`
      + '\`\`\`')
  } catch (err) {
    console.log(err)
  }
}

const punish = async (author, content, channel) => {
  try {

    if (content.length < 2) {
      await channel.send('Punish who?')
      return
    }

    let val = parseInt(content[2])
    if (isNaN(val)) {
      await channel.send(`You need to punish someone by an amount`)
      return
    }

    if (val > 0) {
      val *= -1
    } else if (val === 0) {
      await channel.send(`An empty punishment. I see...?`)
      return
    }

    let id = content[1].replace('<@!', '').replace('>', '')
    let user = await User.findOne({ where: { discordId: id } })

    if (!user) {
      await channel.send(`That member doesn't exist. Did you write their name right?`)
      return
    }

    let s = (val, -1) ? 's' : ''
    await user.changePoints(val)
    await channel.send(
      `Bang! ${val} point${s} have been taken from you!\n`
      + '\`\`\`'
      + `${user.getDataValue('displayName')}: ${user.getDataValue('points')}`
      + '\`\`\`')
  } catch (err) {
    console.log(err)
  }
}

module.exports = {
  onModMessage: async function (msg) {
    let { author, content, channel } = msg
    content = content.split(' ')
    switch (content[0]) {
      case 'e!reward':
        await reward(author, content, channel)
        break

      case 'e!punish':
        await punish(author, content, channel)
        break
      default:
        await this.onMessage(msg)
    }
  },

  onMessage: async function (msg) {
    let { author, content, channel } = msg
    content = content.split(' ')
    switch (content[0]) {
      case 'e!points':
        if (content.length === 1) {
          await points(author, content, channel)
        } else {
          //Old way of gifting was through the use of e!points
          await gift(author, content, channel)
        }
        return
      case 'e!gift':
        await gift(author, content, channel)
        return
      case 'e!role':
        await role(author, content, channel)
        return
    }
  }
}