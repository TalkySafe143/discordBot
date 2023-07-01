import {ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder} from "discord.js";
import {GuildQueue, Player, useMainPlayer} from "discord-player";
import assert from "node:assert";

const data = new SlashCommandBuilder()
    .setName('stop')
    .setDescription('Pausa la reproduccion del bot.');

async function execute(interaction: ChatInputCommandInteraction) {
    const responseEmbed = new EmbedBuilder();
    const player = useMainPlayer();
    try {
        if (!(player instanceof Player)) throw 'No hay instancia del player!';
        const queue = player.queues.cache.at(0);
        if (!(queue instanceof GuildQueue)) throw 'No hay ninguna cola!';
        queue.node.stop(true);
        responseEmbed
            .setColor(0x0099FF)
            .setTitle('Ha parado la reproduccion');
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