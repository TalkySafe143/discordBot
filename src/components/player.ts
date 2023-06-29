import { Player } from 'discord-player'
import {ChatInputCommandInteraction, TextChannel, EmbedBuilder, ClientUser} from "discord.js";
import { client } from '../index'
import assert from "node:assert";
export const player = new Player(client);

// Carga todos los extractores (Youtube, Spotify...)
player.extractors.loadDefault()
    .then(res => console.log(res.success));

player.events.on('playerStart', async (queue, track) => {
    console.log(track);
    assert(queue.metadata instanceof ChatInputCommandInteraction)

    const responseEmbed = new EmbedBuilder()
        .setColor(0x0099FF)
        .setTitle(track.raw.title)
        .setURL(track.url)
        .setAuthor({ name: 'Bosito de Galindo', iconURL: ((client.user as ClientUser).avatarURL() as string), url: 'https://talkysafe143.github.io/' })
        .setDescription(`Se esta reproduciendo: **${track.raw.title}**`)
        .setThumbnail('https://i.imgur.com/Et5AJpz.png')
        .setImage(track.thumbnail)
        .setTimestamp();

    await (queue.metadata.channel as TextChannel).send({ embeds: [ responseEmbed ] });
})
