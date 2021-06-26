const Discord = require('discord.js');
const config = require('./config.json')
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logeado con este user ${client.user.tag}`);
})

client.on('message', msg => {
    if (msg.content === 'ping') msg.reply('pong')
});

client.login(config.TOKEN)