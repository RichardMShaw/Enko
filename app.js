const { token, serverId } = require('./keys')
const { User } = require('./models')
const client = require('./scripts/lib');

let ready = false

const onModMessage = async (msg) => {

}

client.on('guildMemberUpdate', async (oldMem, newMem) => {
  let user = await User.findOne({ where: { discordId: newMem.user.id } })
  user.updateUser(newMem)
});

client.on('message', async msg => {
  if (!ready || msg.author.bot) {
    return;
  }

  let { author, channel, content } = msg
  let { id, tag, username } = author

  let user = await User.checkoutGuildMember(await client.guilds.fetch(user.id))

  console.log(user)

});

client.on('ready', async () => {
  await User.checkoutGuild(await client.guilds.fetch(serverId))
  ready = true
  console.log(`Logged in as ${client.user.tag}!`);
});

require('./db').sync()
  .then(res => {
    client.login(token)
  })
  .catch(err => console.log(err))
