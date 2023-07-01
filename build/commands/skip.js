"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const discord_player_1 = require("discord-player");
const data = new discord_js_1.SlashCommandBuilder()
    .setName('skip')
    .setDescription('Salta a la siguiente cancion en la cola.');
async function execute(interaction) {
    const responseEmbed = new discord_js_1.EmbedBuilder();
    const player = (0, discord_player_1.useMainPlayer)();
    try {
        if (!(player instanceof discord_player_1.Player))
            throw 'No hay instancia del player!';
        const queue = player.queues.cache.at(0);
        if (!(queue instanceof discord_player_1.GuildQueue))
            throw 'No hay ninguna cola!';
        queue.node.skip();
        responseEmbed
            .setColor(0x0099FF)
            .setTitle('Cancion skipeada.');
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
