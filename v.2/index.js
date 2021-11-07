const Discord = require('discord.js');
const config = require('../config.json')
const sendFirstGreeting = require('./actions/firstMessage')
const sendHelpMessage = require('./actions/helpMessage')
const searchSong = require('./actions/searchSong')

const { Cola } = require('../queue')

const client = new Discord.Client();

client.on('ready', () => {
    console.log('Estamos conectados mi pana como: ', client.user.tag)
})

client.on('message', async message => {
    if (!message.content.startsWith(config.PREFIX)) return;

    const msg = message.content.split(" ")
    const command = msg.shift()
    const params = msg.join(" ")

    switch (command) {
        case '$status':
            message.guild.voice !== undefined
            ? message.reply('Estoy conectado a un canal de voz') :
            message.reply('No estoy conectado a ningún canal por el momento');
        break;

        default:
            message.react('😨')
            message.reply(`
                Lo siento, no encuentro ese comando en mi lista 😕
                Pero puedes introducir '$help' para obtener la lista de los comandos!
            `)
        break;

        case '$help':
            sendHelpMessage(message);
        break;

        case '$play':
            if (!message.member.voice.channel) {
                message.reply("Primero tienes que estar en un canal de voz! 🥺");
                return;
            }

            const song = await searchSong(params);

            if (!song) {
                message.react('🔍')
                message.reply('Ups, por alguna razón no pude encontrar la cancion.')
                return
            }

        break;
    }
})

client.on('guildCreate', sendFirstGreeting)

client.login(config.TOKEN);