"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const data = new discord_js_1.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde a un llamado de prueba');
async function execute(interaction) {
    await interaction.reply(`Pong! ${interaction.member}`);
}
module.exports = {
    data,
    execute
};
