const Discord = require('discord.js')

function sendFirstGreeting(guild) {
    const date = new Date();

    let now, channelToSend;

    if (date.getHours() <= 7 && date.getHours() >= 0) now = "¡Buenos días! ¿O madrugada?";
    else if (date.getHours() > 7 && date.getHours() <= 12) now = "¡Buenos días!";
    else if (date.getHours() > 12 && date.getHours() <= 18) now = "¡Buenas tardes!";
    else if (date.getHours() > 18 && date.getHours() < 24) now = "¡Buenas noches!";

    guild.channels.cache.forEach(channel => {
        if (channel.type === 'text' && !channelToSend) channelToSend = channel;
    })

    channelToSend.send(
        new Discord.MessageEmbed()
      .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
      .setDescription(
        `
                **${now}, me alegro que me hayas agregado a tu servidor!:moyai:**

                En este mensaje te voy a indicar todos los comandos que tengo disponible con sus funcionalidades. ***Si quieres fija este mensaje***

                *Todos los comandos van con el sufijo: '$'* Ejemplo: $play Esclava Remix

                > *play <NOMBRE DE LA CANCION>* - Permite reproducir canciones por medio de Youtube.
            `
      )
      .setColor("GREEN")
    )
}

module.exports = sendFirstGreeting;