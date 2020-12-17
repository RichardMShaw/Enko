const { token } = require('./keys')
const { User } = require('./models')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', msg => {
  let { id, tag, username } = msg.author
  User.findOrCreate({
    where: { discordId: id },
    defaults: {
      discordId: id,
      tag,
      displayName: username,
      points: 0
    }
  })
    .then((user) => {
      //console.log(user[0])
      user[0].change_points(5)
    })
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

require('./db').sync()
  .then(res => {
    client.login(token)
  })
  .catch(err => console.log(err))
