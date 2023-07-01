"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const index_1 = require("../index");
const data = new discord_js_1.SlashCommandBuilder()
    .setName('ping')
    .setDescription('Responde a un llamado de prueba');
async function execute(interaction) {
    await interaction.reply(`Pong! ${interaction.member}, respondido en ${index_1.client.ws.ping}ms`);
}
module.exports = {
    data,
    execute
};
