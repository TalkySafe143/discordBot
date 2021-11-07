import Discord from 'discord.js';
import youtubeApi from "ytdl-core";
import ytSearch from "youtube-search";
import config from '../config.json';

let dispatcher: Discord.StreamDispatcher;

export function playSong (connection: Discord.VoiceConnection, songLink: string, msg: Discord.Message, results: ytSearch.YouTubeSearchResults[]) {
    console.log('[PLAYER] Entró a la funcion playsong')
    dispatcher = connection.play(youtubeApi(songLink));
    setTimeout(() => {
        if (dispatcher === undefined) {
            console.log('[PLAYER] Al parecer hay problemas con la API de Youtube')
        } else {
            console.log('[PLAYER] Todo Bien!')
        }
    }, 5000)
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

    return dispatcher;
};

export function YoutubeSearch (keywords: string) {
    return ytSearch(keywords, { maxResults: 1, key: config.API_KEY })
};

