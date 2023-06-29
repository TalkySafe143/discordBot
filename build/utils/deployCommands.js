"use strict";
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v10');
const config = require('../config');
const fs = require('node:fs');
const path = require('node:path');
const debug = require('debug')('deploy:commands');
const commands = [];
const commandsPaths = path.join(__dirname, '../commands');
const commandFiles = fs.readdirSync(commandsPaths).filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
    const filePath = path.join(commandsPaths, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
    else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`);
    }
}
const rest = new REST().setToken(config.token);
(async () => {
    try {
        debug(`Desplegando ${commands.length} application (/) commands`);
        const data = await rest.put(Routes.applicationGuildCommands(config.clientId, config.guildId), {
            body: commands
        });
        debug(`Desplegados ${data.length} application (/) commands`);
    }
    catch (e) {
        console.log(e);
    }
})();
