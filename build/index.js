"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const assert = require('node:assert');
const config = require('./config');
const fs = require('node:fs');
const path = require('node:path');
const discord_js_1 = require("discord.js");
const debug = require('debug')('server:info');
class ClientCommands extends discord_js_1.Client {
}
const client = new ClientCommands({ intents: discord_js_1.IntentsBitField.resolve(0) });
client.commands = new discord_js_1.Collection();
const commandsPaths = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPaths).filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPaths, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
    else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`);
    }
}
client.once(discord_js_1.Events.ClientReady, c => {
    debug(`Ready! Logged in as ${c.user.tag}`);
});
client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (!interaction.isChatInputCommand())
        return;
    //console.log(interaction);
    const command = interaction.client
        .commands.get(interaction.commandName);
    if (!command) {
        debug(`No matching command ${interaction.commandName}`);
        return;
    }
    try {
        await command.execute(interaction);
    }
    catch (err) {
        debug(err);
        (interaction.replied
            ||
                interaction.deferred) ?
            await interaction.followUp({
                content: 'Hubo un error mientras se ejecutaba el comando!',
                ephemeral: true
            }) :
            await interaction.reply({
                content: 'Hubo un error mientras se ejecutaba el comando!',
                ephemeral: true
            });
    }
});
client.login(config.token);
