import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {GuildQueue, Player, useMainPlayer} from "discord-player";
import assert from "node:assert";

const data = new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla aleatoriamente la cola.');

async function execute(interaction: ChatInputCommandInteraction) {
    const responseEmbed = new EmbedBuilder();
    const player = useMainPlayer();
    try {
        if (!(player instanceof Player)) throw 'No hay instancia del player!';
        const queue = player.queues.cache.at(0);
        if (!(queue instanceof GuildQueue)) throw 'No hay ninguna cola!';

        if (queue.tracks.size === 1) throw 'Solo hay una cancion en la lista.'

        for (let i = 0; i < queue.tracks.size; i++) {
            let randNumber = -1;

            while (randNumber < 0) {
                randNumber = Math.round((Math.random()*100) % (queue?.tracks.size)) - 1;
            }

            queue?.node.swap(i, randNumber);
        }

        responseEmbed
            .setColor(0x0099FF)
            .setTitle('La lista de reproduccion ha sido mezclada');
    } catch (e) {
        responseEmbed
            .setColor(0x0000FF)
            .setTitle((e as string));
    }

    return interaction.reply({ embeds: [ responseEmbed ] });
}

module.exports = {
    data,
    execute
}