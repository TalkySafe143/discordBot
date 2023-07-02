"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DeezerExtractor = void 0;
const discord_player_1 = require("discord-player");
class DeezerExtractor extends discord_player_1.BaseExtractor {
    constructor() {
        super(...arguments);
        this.createBridgeQuery = (track) => `${track.title} by ${track.author} official audio`;
    }
}
exports.DeezerExtractor = DeezerExtractor;
DeezerExtractor.indentifier = 'bbb7cc1efb64c2fe01fffcca2fa1553e12ab79c9';
