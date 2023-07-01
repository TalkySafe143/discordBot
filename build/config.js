"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.configObject = void 0;
const dotenv = require('dotenv');
dotenv.config();
exports.configObject = {
    token: process.env.TOKEN ?? "",
    clientId: process.env.APPLICATION_ID ?? "",
    guildId: process.env.GUILD_ID ?? ""
};
