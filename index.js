const Discord = require("discord.js");
const config = require("./config.json");
const client = new Discord.Client();
const youtubeApi = require("ytdl-core");
const ytSearch = require("youtube-search");

const playSong = (connection, songLink, msg) => {
  const dispatcher = connection.play(youtubeApi(songLink));
  msg.channel.send(
    new Discord.MessageEmbed()
      .setAuthor(msg.author.username)
      .setDescription(
        `
                            ***Reproduciendo...***
                            ${results[0].title}
                            
                            De: **${results[0].channelTitle}**.
                            
                            Descripción: ${results[0].description}.
                            
                            ${results[0].link}
                            `
      )
      .setColor("DARK_RED")
  );
};

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
      let songsToPlay = [];

      if (!msg.member.voice.channel) {
        msg.reply("Primero tienes que estar en un canal de voz! :confused:");
        return;
      }
      ytSearch(
        params,
        { maxResults: 1, key: config.API_KEY },
        (err, results) => {
          if (err) {
            msg.reply("Ups! Algo salió mal con la busqueda:(");
            console.log(err);
          }
          if (!songsToPlay[0]) {
            songsToPlay.push(results[0].link);
            msg.member.voice.channel
              .join()
              .then((connection) => {
                  playSong(connection, songsToPlay.shift(), msg);
              })
              .catch((err) => {
                msg.reply(
                  "!Al parecer algo ha salido mal con el canal de voz!"
                );
                console.log(err);
              });
          } else {
            songsToPlay.push(results[0].link);
            playSong(msg.guild.voice.connection, songsToPlay.shift(), msg)
          }
        }
      );
      break;

    case "$estasConectado":
      if (msg.guild.voice.connection) msg.reply("Si");
      else msg.reply("No");
  }
});

client.on("guildCreate", (guild) => {
  const date = new Date();
  let channelToSend, now;

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
