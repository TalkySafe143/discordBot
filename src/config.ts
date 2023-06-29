const dotenv = require('dotenv')
dotenv.config()

interface ConfigEnv {
    token: string,
    clientId: string,
    guildId: string
}

export const configObject : ConfigEnv = {
    token: process.env.TOKEN ?? "",
    clientId: process.env.APPLICATION_ID ?? "",
    guildId: process.env.GUILD_ID ?? ""
}