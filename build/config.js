"use strict";
const dotenv = require('dotenv');
dotenv.config();
module.exports = {
    token: process.env.TOKEN,
    clientId: process.env.APPLICATION_ID,
    guildId: process.env.GUILD_ID
};
