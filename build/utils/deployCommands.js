"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_1 = require("../config");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const debug_1 = require("debug");
const debug = (0, debug_1.debug)('deploy:commands');
const commands = [];
const commandsPaths = node_path_1.default.join(__dirname, '../commands');
const commandFiles = node_fs_1.default.readdirSync(commandsPaths).filter((file) => file.endsWith('.ts'));
for (const file of commandFiles) {
    const filePath = node_path_1.default.join(commandsPaths, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        commands.push(command.data.toJSON());
    }
    else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`);
    }
}
const rest = new discord_js_1.REST().setToken(config_1.configObject.token);
(async () => {
    try {
        debug(`Desplegando ${commands.length} application (/) commands`);
        const data = await rest.put(discord_js_1.Routes.applicationGuildCommands(config_1.configObject.clientId, config_1.configObject.guildId), {
            body: commands
        });
        debug(`Desplegados ${data.length} application (/) commands`);
    }
    catch (e) {
        console.log(e);
    }
})();
