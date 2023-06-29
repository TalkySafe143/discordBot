import {ChatInputCommandInteraction, SlashCommandBuilder} from "discord.js";
import { client } from '../index'

const data = new SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde a un llamado de prueba')

async function execute(interaction: ChatInputCommandInteraction) {
    await interaction.reply(`Pong! ${interaction.member}, respondido en ${client.ws.ping}ms`);
}

module.exports = {
    data,
    execute
}