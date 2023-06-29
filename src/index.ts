import fs from 'node:fs';
import { configObject as config } from './config';
import path from 'node:path';
 import {
    Client,
    Events,
    Collection,
    ChatInputCommandInteraction, AutocompleteInteraction
} from 'discord.js'

import { debug as debugConfig } from 'debug';
import assert from "node:assert";
const debug = debugConfig('server:info');

class ClientCommands extends Client {
    public commands!: Collection<any, any>;
}

export const client = new ClientCommands({ intents: ["GuildVoiceStates", "Guilds"] });

client.commands = new Collection();

const commandsPaths = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPaths).filter((file : string) => file.endsWith('.ts'));

for (const file of commandFiles) {
    const filePath = path.join(commandsPaths, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        debug(`[WARNING] The command at ${filePath} is missing parameters execute and data`,  );
    }
}

client.once(Events.ClientReady, c => {
    debug(`Ready! Logged in as ${c.user.tag}`)
});

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isAutocomplete()) {
        const command = (interaction.client as ClientCommands)
            .commands.get(
                (interaction as ChatInputCommandInteraction).commandName
            );

        if (!command) {
            debug(`No matching command ${(interaction as ChatInputCommandInteraction).commandName}`);
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
            debug(err);
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