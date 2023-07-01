"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const discord_player_1 = require("discord-player");
const node_assert_1 = __importDefault(require("node:assert"));
const images = {
    'soundcloud': 'https://cdn-icons-png.flaticon.com/512/145/145809.png',
    "youtube": 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    "spotify": 'https://i.imgur.com/Et5AJpz.png',
    "apple_music": 'https://cdn-icons-png.flaticon.com/512/7566/7566380.png',
    "arbitrary": 'https://cdn-icons-png.flaticon.com/512/2402/2402461.png'
};
const data = new discord_js_1.SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una cancion')
    .addStringOption(option => option
    .setName('query')
    .setDescription('Nombre de la cancion a reproducir')
    .setRequired(true)
    .setAutocomplete(true));
async function autocompleteRun(interaction) {
    const player = (0, discord_player_1.useMainPlayer)();
    const query = interaction.options.getString('query', true);
    if (query.includes('https')) {
        return interaction.respond([
            {
                name: 'Este es un link!',
                value: query
            }
        ]);
    }
    let results;
    if (player instanceof discord_player_1.Player) {
        results = await player.search(query === "" ? " " : query);
    }
    else {
        return;
    }
    return interaction.respond(results.tracks.slice(0, 10).map(track => ({
        name: track.title + '  -  ' + track.author + ' 🔊',
        value: track.url
    })));
}
async function execute(interaction) {
    const player = (0, discord_player_1.useMainPlayer)();
    if (!(player instanceof discord_player_1.Player)) {
        return;
    }
    const channel = interaction.member.voice.channel;
    if (!channel)
        return interaction.reply('No esta conectado en ningún canal!');
    const query = interaction.options.getString('query', true);
    await interaction.deferReply();
    const responseEmbed = new discord_js_1.EmbedBuilder();
    try {
        const searchResult = await player.search(query, { requestedBy: interaction.user });
        if (!searchResult.hasTracks()) {
            throw 'No se encontraron canciones';
        }
        const response = await player.play(channel, searchResult, { nodeOptions: { metadata: interaction } });
        (0, node_assert_1.default)(response.track.raw.source);
        responseEmbed
            .setColor(0x0099FF)
            .setTitle(response.track.raw.title)
            .setURL(response.track.url)
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: index_1.client.user.avatarURL() })
            .setDescription(`Agregado a la cola: **${response.track.title}**`)
            .setThumbnail(images[response.track.raw.source])
            .setImage(response.track.thumbnail)
            .setTimestamp();
        return interaction.followUp({ embeds: [responseEmbed] });
    }
    catch (e) {
        responseEmbed
            .setColor(0x0000FF)
            .setTitle('Ups, algo salió mal! ' + e)
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: index_1.client.user.avatarURL() })
            .setTimestamp();
        return interaction.followUp({ embeds: [responseEmbed] });
    }
}
module.exports = {
    data,
    execute,
    autocompleteRun
};
