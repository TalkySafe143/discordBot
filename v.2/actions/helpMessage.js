const Discord = require('discord.js')

function helpMessage(message) {
    message.channel.send(
        new Discord.MessageEmbed()
            .setAuthor(client.user.username)
            .setDescription(
                `
                        En este mensaje te voy a indicar todos los comandos que tengo disponible con sus funcionalidades. ***Si quieres fija este mensaje***

                        *Todos los comandos van con el sufijo: '$'*   Ejemplo: $play...

                        > *play <NOMBRE DE LA CANCION>* - Permite reproducir canciones por medio de Youtube.
                    `
            )
            .setColor('BLUE')
    )
}

module.exports = helpMessage