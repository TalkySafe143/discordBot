import {
    AutocompleteInteraction,
    ChatInputCommandInteraction,
    ClientUser,
    EmbedBuilder,
    GuildMember,
    SlashCommandBuilder
} from "discord.js";
import { player } from '../components/player'
import {client} from "../index";
import { useMainPlayer } from 'discord-player'

const data = new SlashCommandBuilder()
    .setName('play')
    .setDescription('Reproduce una cancion')
    .addStringOption(option =>
        option
            .setName('query')
            .setDescription('Nombre de la cancion a reproducir')
            .setRequired(true)
    )

async function autocompleteRun(interaction: AutocompleteInteraction) {
    const player = useMainPlayer();
    const query = interaction.options.getString('query')
}

async function execute(interaction: ChatInputCommandInteraction) {
    const channel = (interaction.member as GuildMember).voice.channel;
    if (!channel) return interaction.reply('No esta conectado en ningún canal!');

    const query = interaction.options.getString('query', true);

    await interaction.deferReply();

    const responseEmbed = new EmbedBuilder();

    try {
        const response = await player.play(channel, query, { nodeOptions: { metadata: interaction } });

        responseEmbed
            .setColor(0x0099FF)
            .setTitle(response.track.raw.title)
            .setURL(response.track.url)
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: ((client.user as ClientUser).avatarURL() as string) })
            .setDescription(`Agregado a la cola: **${response.track.title}**`)
            .setThumbnail('https://i.imgur.com/Et5AJpz.png')
            .setImage(response.track.thumbnail)
            .setTimestamp();

        return interaction.followUp({ embeds: [responseEmbed] })
    } catch (e) {
        responseEmbed
            .setColor(0x0000FF)
            .setTitle('Ups, algo salió mal!')
            .setAuthor({ name: 'Botsito de Galindo', url: 'https://talkysafe143.github.io/', iconURL: ((client.user as ClientUser).avatarURL() as string) })
            .setTimestamp();
        console.log(e);
        return interaction.followUp({ embeds: [ responseEmbed ] });
    }
}

module.exports = {
    data,
    execute
}