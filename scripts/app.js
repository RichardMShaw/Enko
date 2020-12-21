const { token, serverId } = require('../keys')
const { User, Role } = require('../models')

const client = require('./global/client')
const parseMsg = require('./parse-msg')

client.on('guildMemberUpdate', async (oldMem, newMem) => {
  try {
    let user = await User.findOne({ where: { discordId: newMem.user.id } })
    await user.updateUser(newMem)
  } catch (err) { console.log(err) }
})

client.on('message', async msg => {
  if (!ready || msg.author.bot) {
    return;
  }

  msg.content = msg.content.toLowerCase()

  try {
    let guild = await client.guilds.fetch(serverId)
    let guildMember = await guild.members.fetch(msg.author.id)
    let user = await User.checkoutGuildMember(guildMember)
    if (user.isMod) {
      await parseMsg.onModMessage(msg)
    }

  } catch (err) { console.log(err) }

})

client.on('ready', async () => {
  try {
    ready = true
    let guild = await client.guilds.fetch(serverId)
    await User.checkoutGuild(guild)
    await Role.checkoutGuild(guild)
    console.log(`Logged in as ${client.user.tag}!`);
  } catch (err) { console.log(err) }
})

module.exports = {
  init: () => {
    client.login(token)
  }
}