"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const data = new discord_js_1.SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('Mezcla aleatoriamente la cola.');
async function execute(interaction) {
    const responseEmbed = new discord_js_1.EmbedBuilder();
    const player = (0, discord_player_1.useMainPlayer)();
    try {
        if (!(player instanceof discord_player_1.Player))
            throw 'No hay instancia del player!';
        const queue = player.queues.cache.at(0);
        if (!(queue instanceof discord_player_1.GuildQueue))
            throw 'No hay ninguna cola!';
        if (queue.tracks.size === 1)
            throw 'Solo hay una cancion en la lista.';
        for (let i = 0; i < queue.tracks.size; i++) {
            let randNumber = -1;
            while (randNumber < 0) {
                randNumber = Math.round((Math.random() * 100) % (queue?.tracks.size)) - 1;
            }
            queue?.node.swap(i, randNumber);
        }
        responseEmbed
            .setColor(0x0099FF)
            .setTitle('La lista de reproduccion ha sido mezclada');
    }
    catch (e) {
        responseEmbed
            .setColor(0x0000FF)
            .setTitle(e);
    }
    return interaction.reply({ embeds: [responseEmbed] });
}
module.exports = {
    data,
    execute
};
