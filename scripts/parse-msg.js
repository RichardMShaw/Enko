const client = require('./global');
const { User } = require('../models')
const { serverId } = require('../keys')

module.exports = {
  onModMessage: async (msg) => {
    let { author, content, channel } = msg
    content = content.toLowerCase().split(' ')
    switch (content[0]) {
      case 'e!reward':
        if (content.length > 2) {
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
            + `${user.getDataValue('displayName')}:${user.getDataValue('points')}`
            + '\`\`\`')
        } else {
          await channel.send('Reward what?')
        }
        break
    }
  }
}