const { token, serverId } = require('./keys')
const { User } = require('./models')

const client = require('./scripts/global')
let guild = {}

const parseMsg = require('./scripts/parse-msg')

let ready = false

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

  try {
    let user = await User.checkoutGuildMember(await guild.members.fetch(msg.author.id))
    if (user.isMod) {
      await parseMsg.onModMessage(msg)
    }

  } catch (err) { console.log(err) }

})

client.on('ready', async () => {
  try {
    guild = await client.guilds.fetch(serverId)
    await User.checkoutGuild(guild)
    ready = true
    console.log(`Logged in as ${client.user.tag}!`);
  } catch (err) { console.log(err) }
})

require('./db').sync()
  .then(res => {
    client.login(token)
  })
  .catch(err => console.log(err))
