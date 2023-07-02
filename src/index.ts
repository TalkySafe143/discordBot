import fs from 'node:fs';
import { configObject as config } from './config';
import path from 'node:path';
 import {
    Client,
    Events,
    Collection,
    ChatInputCommandInteraction, AutocompleteInteraction, EmbedBuilder, ClientUser, TextChannel
 } from 'discord.js'

import { debug as debugConfig } from 'debug';
import assert from "node:assert";
import {Player, useMainPlayer} from "discord-player";
const debug = debugConfig('server:info');

const images = {
    'soundcloud': 'https://cdn-icons-png.flaticon.com/512/145/145809.png',
    "youtube" : 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png',
    "spotify" : 'https://i.imgur.com/Et5AJpz.png',
    "apple_music" : 'https://cdn-icons-png.flaticon.com/512/7566/7566380.png',
    "arbitrary" : 'https://cdn-icons-png.flaticon.com/512/2402/2402461.png'
}


export class ClientCommands extends Client {
    public commands!: Collection<any, any>;
}

export const client = new ClientCommands({ intents: ["GuildVoiceStates", "Guilds"] });

client.commands = new Collection();

const commandsPaths = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPaths).filter((file : string) => file.endsWith('.ts') || file.endsWith('.js'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPaths, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`,);
    }
}

client.once(Events.ClientReady, c => {

    debug(`Ready! Logged in as ${c.user.tag}`)
    const player = new Player(c);
    player.extractors.loadDefault()
        .then(res => debug('Extractores del player listos.'));

    // Player events

    player.events.on('playerStart', async (queue, track) => {
        console.log('Reproduciendo ' + track.raw.title);
        assert(queue.metadata instanceof ChatInputCommandInteraction)

        assert(track.raw.source);

        const responseEmbed = new EmbedBuilder()
            .setColor(0x00BE00)
            .setTitle(track.raw.title)
            .setURL(track.url)
            .setAuthor({ name: 'Bosito de Galindo', iconURL: ((client.user as ClientUser).avatarURL() as string), url: 'https://talkysafe143.github.io/' })
            .setDescription(`Se esta reproduciendo: **${track.raw.title}**`)
            .setThumbnail(images[track.raw.source])
            .setImage(track.thumbnail)
            .setTimestamp();

        await (queue.metadata.channel as TextChannel).send({ embeds: [ responseEmbed ] });
    });

    player.events.on("debug", (queue, message) => {
        debug(message)
    })
});


client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
        const command = (interaction.client as ClientCommands)
            .commands.get(
                (interaction as AutocompleteInteraction).commandName
            );

        if (!command) {
            debug(`No matching command ${(interaction as AutocompleteInteraction).commandName}`);
            return;
        }

        assert('autocompleteRun' in command);

        try {
            await command.autocompleteRun((interaction as AutocompleteInteraction));
        } catch (e) {
            console.log(e);
        }
    }

    if (interaction.isChatInputCommand()) {
        const command = (interaction.client as ClientCommands)
            .commands.get(
                (interaction as ChatInputCommandInteraction).commandName
            );

        if (!command) {
            debug(`No matching command ${(interaction as ChatInputCommandInteraction).commandName}`);
            return;
        }

        try {
            await command.execute((interaction as ChatInputCommandInteraction));
        } catch (err) {
            console.log(err);
            (
                (interaction as ChatInputCommandInteraction).replied
                ||
                (interaction as ChatInputCommandInteraction).deferred
            ) ?
                await (interaction as ChatInputCommandInteraction).followUp({
                    content: 'Hubo un error mientras se ejecutaba el comando!',
                    ephemeral: true
                }) :
                await (interaction as ChatInputCommandInteraction).reply({
                    content: 'Hubo un error mientras se ejecutaba el comando!',
                    ephemeral: true
                });
        }
    }
})

client.login(config.token);