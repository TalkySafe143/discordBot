import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientUser,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder
} from "discord.js";
import {client} from "../index";
import {Player, SearchResult, useMainPlayer} from 'discord-player'
import assert from "node:assert";

const images = {
    'soundcloud': 'https://cdn-icons-png.flaticon.com/512/145/145809.png',
    "youtube" : 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    "spotify" : 'https://i.imgur.com/Et5AJpz.png',
    "apple_music" : 'https://cdn-icons-png.flaticon.com/512/7566/7566380.png',
    "arbitrary" : 'https://cdn-icons-png.flaticon.com/512/2402/2402461.png'
}

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una cancion')
    .addStringOption(option =>
        option
            .setName('query')
            .setDescription('Nombre de la cancion a reproducir')
            .setRequired(true)
            .setAutocomplete(true)
    )

async function autocompleteRun(interaction: AutocompleteInteraction) {
    const player = useMainPlayer();
    const query = interaction.options.getString('query', true);

    if (query.includes('https')) {
        return interaction.respond([
            {
                name: 'Este es un link!',
                value: query
            }
            ]
        )
    }

    let results : SearchResult;
    if (player instanceof Player) {
        results = await player.search(query === ""? " " : query);
    } else {
        return;
    }

    return interaction.respond(
        results.tracks.slice(0, 10).map(track => ({
            name: track.title + '  -  ' + track.author + ' 🔊',
            value: track.url
        }))
    )
}

async function execute(interaction: ChatInputCommandInteraction) {

    const player = useMainPlayer();

    if (!(player instanceof Player)) {
        return;
    }

    const channel = (interaction.member as GuildMember).voice.channel;
    if (!channel) return interaction.reply('No esta conectado en ningún canal!');

    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    const responseEmbed = new EmbedBuilder();

    try {

        const searchResult = await player.search(query, { requestedBy: interaction.user });

        if (!searchResult.hasTracks()) {
            throw 'No se encontraron canciones';
        }

        const response = await player.play(channel, searchResult, { nodeOptions: { metadata: interaction } });

        assert(response.track.raw.source);

        responseEmbed
            .setColor(0x0099FF)
            .setTitle(response.track.raw.title)
            .setURL(response.track.url)
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: ((client.user as ClientUser).avatarURL() as string) })
            .setDescription(`Agregado a la cola: **${response.track.title}**`)
            .setThumbnail(images[response.track.raw.source])
            .setImage(response.track.thumbnail)
            .setTimestamp();

        return interaction.followUp({ embeds: [responseEmbed] })
    } catch (e) {
        responseEmbed
            .setColor(0x0000FF)
            .setTitle('Ups, algo salió mal! ' + e)
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: ((client.user as ClientUser).avatarURL() as string) })
            .setTimestamp();
        return interaction.followUp({ embeds: [ responseEmbed ] });
    }
}

module.exports = {
    data,
    execute,
    autocompleteRun
}