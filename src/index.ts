const assert = require('node:assert')
const config = require('./config');
const fs = require('node:fs');
const path = require('node:path');
import {
    Client,
    Events,
    Collection,
    IntentsBitField,
    ChatInputCommandInteraction,
} from 'discord.js'

const debug = require('debug')('server:info');

class ClientCommands extends Client {
    public commands!: Collection<any, any>;
}

const client = new ClientCommands({ intents: IntentsBitField.resolve(0) });

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
    if (!interaction.isChatInputCommand()) return;
    //console.log(interaction);

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
})

client.login(config.token);