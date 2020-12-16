const { token } = require('./keys')
const Discord = require('discord.js');
const client = new Discord.Client();


require('./db').sync()
  .then(client.login(token);)
  .catch (err => console.log(err))
