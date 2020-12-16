const { token } = require('./keys')
const Discord = require('discord.js');
const client = new Discord.Client();

client.on('message', msg => {
  if (msg.content === 'ping') {
    msg.channel.send('Pong!')
  }
});

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

require('./db').sync()
  .then(res => {
    client.login(token)
  })
  .catch(err => console.log(err))
