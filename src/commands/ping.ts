import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde a un llamado de prueba')

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Pong! ${interaction.member}`);
}

module.exports = {
    data,
    execute
}