"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.client = exports.ClientCommands = void 0;
const node_fs_1 = __importDefault(require("node:fs"));
const config_1 = require("./config");
const node_path_1 = __importDefault(require("node:path"));
const discord_js_1 = require("discord.js");
const debug_1 = require("debug");
const node_assert_1 = __importDefault(require("node:assert"));
const discord_player_1 = require("discord-player");
const debug = (0, debug_1.debug)('server:info');
const images = {
    'soundcloud': 'https://cdn-icons-png.flaticon.com/512/145/145809.png',
    "youtube": 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    "spotify": 'https://i.imgur.com/Et5AJpz.png',
    "apple_music": 'https://cdn-icons-png.flaticon.com/512/7566/7566380.png',
    "arbitrary": 'https://cdn-icons-png.flaticon.com/512/2402/2402461.png'
};
class ClientCommands extends discord_js_1.Client {
}
exports.ClientCommands = ClientCommands;
exports.client = new ClientCommands({ intents: ["GuildVoiceStates", "Guilds"] });
exports.client.commands = new discord_js_1.Collection();
const commandsPaths = node_path_1.default.join(__dirname, 'commands');
const commandFiles = node_fs_1.default.readdirSync(commandsPaths).filter((file) => file.endsWith('.ts') || file.endsWith('.js'));
for (const file of commandFiles) {
    const filePath = node_path_1.default.join(commandsPaths, file);
    const command = require(filePath);
    if ('data' in command && 'execute' in command) {
        exports.client.commands.set(command.data.name, command);
    }
    else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`);
    }
}
exports.client.once(discord_js_1.Events.ClientReady, c => {
    debug(`Ready! Logged in as ${c.user.tag}`);
    const player = new discord_player_1.Player(c);
    player.extractors.loadDefault()
        .then(res => debug('Extractores del player listos.'));
    // Player events
    player.events.on('playerStart', async (queue, track) => {
        console.log('Reproduciendo ' + track.raw.title);
        (0, node_assert_1.default)(queue.metadata instanceof discord_js_1.ChatInputCommandInteraction);
        (0, node_assert_1.default)(track.raw.source);
        const responseEmbed = new discord_js_1.EmbedBuilder()
            .setColor(0x00BE00)
            .setTitle(track.raw.title)
            .setURL(track.url)
            .setAuthor({ name: 'Bosito de Galindo', iconURL: exports.client.user.avatarURL(), url: 'https://talkysafe143.github.io/' })
            .setDescription(`Se esta reproduciendo: **${track.raw.title}**`)
            .setThumbnail(images[track.raw.source])
            .setImage(track.thumbnail)
            .setTimestamp();
        await queue.metadata.channel.send({ embeds: [responseEmbed] });
    });
});
exports.client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
        const command = interaction.client
            .commands.get(interaction.commandName);
        if (!command) {
            debug(`No matching command ${interaction.commandName}`);
            return;
        }
        (0, node_assert_1.default)('autocompleteRun' in command);
        try {
            await command.autocompleteRun(interaction);
        }
        catch (e) {
            console.log(e);
        }
    }
    if (interaction.isChatInputCommand()) {
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
            console.log(err);
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
    }
});
exports.client.login(config_1.configObject.token);
