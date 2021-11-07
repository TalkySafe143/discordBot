import * as Discord from "discord.js";
import config from "./config.json";
const client = new Discord.Client();
import * as myPlayer from './components/player';
import { Cola } from './queue';

let ActualDispatcher: Discord.StreamDispatcher;
let isSpeaking: any;
const queue = new Cola();
let ActualConnection: Discord.VoiceConnection;
let alreadyFinish: boolean = false;

client.on("ready", () => {
  console.log(`Logeado con este user ${client.user.tag}`);
});

client.on("message", async (msg) => {

  if (!msg.content.startsWith(config.PREFIX)) return;

  const message = msg.content.split(" ");
  const command = message.shift();
  const params = message.join(" ");

  switch (command) {
    case "$play":
        console.log('[INDEX] Entro al comando Play')
      if (!msg.member.voice.channel) {
        msg.reply("Primero tienes que estar en un canal de voz! :confused:");
        return;
      }

      console.log(`[INDEX] ActualDispatcher ya tiene valor? ${ActualDispatcher !== undefined}`)

      console.log(`[INDEX] Este es el valor de isSpeaking antes de entrar a la funcion: ${isSpeaking}`)

      myPlayer.YoutubeSearch(params)
        .then( async results => {
            queue.enqueue(results.results[0].link);
            console.log(queue)
            debugger;
            if (isSpeaking === undefined) {
                console.log('[INDEX] Entro al If que no tiene cola')
                const connection = await msg.member.voice.channel.join();
                ActualConnection = connection;
                ActualDispatcher = myPlayer.playSong(connection, queue.dequeue().value, msg, results.results)
                ActualDispatcher.on('speaking', speaking => {
                    if (isSpeaking) return;
                    console.log('Entro al evento SPEAKING (sin cola), osea, seteo el valor.');
                    isSpeaking = speaking;
                    alreadyFinish = false;
                })
            } else if (isSpeaking === 1){
                console.log('[INDEX] Entro al If que si tiene cola')
                msg.channel.send(
                    new Discord.MessageEmbed()
                    .setAuthor(msg.author.username)
                    .setColor('DARK_RED')
                    .setDescription(
                        `
                                            ***¡AÑADIDO A LA COLA!***
                                            ${results.results[0].title}

                                            De: **${results.results[0].channelTitle}**.
                                            `
                    )
                )
                ActualDispatcher.on('finish', () => {
                    if (!alreadyFinish) {
                        alreadyFinish = true;
                        console.log('[INDEX] Ya he terminado de reporducir!')
                        ActualDispatcher = myPlayer.playSong(ActualConnection, queue.dequeue().value, msg, results.results)
                        debugger;
                    }
                    console.log('[INDEX] Ya he terminado, pero no entre a la reproduccion!')
                })
                ActualDispatcher.on('speaking', speaking => {
                    if (isSpeaking) return;
                    console.log('Entro al evento SPEAKING (cola), osea, seteo el valor.');
                    isSpeaking = speaking;
                    alreadyFinish = false;
                })
            }
        })
        .catch( (error: Error) => {
            msg.react('💨')
            msg.reply('Ups! Algo salió mal con la busqueda.')
            console.log(error)
        });

      break;
      case "$help":
          msg.channel.send(
              new Discord.MessageEmbed()
                .setAuthor('Botsito de Galindo')
                .setColor('BLUE')
                .setDescription(
                    `
                            En este mensaje te voy a indicar todos los comandos que tengo disponible con sus funcionalidades. ***Si quieres fija este mensaje***

                            *Todos los comandos van con el sufijo: '$'* Ejemplo: $play Esclava Remix

                            > *play <NOMBRE DE LA CANCION>* - Permite reproducir canciones por medio de Youtube.
                        `
                  )
          )
          break;
    case "$estasConectado":
      msg.guild.voice !== undefined ? msg.reply("Si") : msg.reply("No");
      break;
    default:
        msg.react('😭')
        msg.reply('Lo siento, creo que el comando que tratas de enviar no esta en mi lista de comandos! :confused:')
        break;

  }
});

client.on("guildCreate", (guild) => {
  const date = new Date();
  let channelToSend: any | Discord.GuildChannel, now: string;

  if (date.getHours() <= 7 && date.getHours() >= 0)
    now = "¡Buenos días! ¿O madrugada?";
  else if (date.getHours() > 7 && date.getHours() <= 12) now = "¡Buenos días!";
  else if (date.getHours() > 12 && date.getHours() <= 18)
    now = "¡Buenas tardes!";
  else if (date.getHours() > 18 && date.getHours() < 24)
    now = "¡Buenas noches!";

  guild.channels.cache.forEach((channel) => {
    if (channel.type === "text" && !channelToSend) channelToSend = channel;
  });
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
  );
});

client.login(config.TOKEN);