"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
exports.YoutubeSearch = exports.playSong = void 0;
var discord_js_1 = __importDefault(require("discord.js"));
var ytdl_core_1 = __importDefault(require("ytdl-core"));
var youtube_search_1 = __importDefault(require("youtube-search"));
var config_json_1 = __importDefault(require("../config.json"));
var dispatcher;
function playSong(connection, songLink, msg, results) {
    console.log('[PLAYER] Entró a la funcion playsong');
    dispatcher = connection.play((0, ytdl_core_1["default"])(songLink));
    setTimeout(function () {
        if (dispatcher === undefined) {
            console.log('[PLAYER] Al parecer hay problemas con la API de Youtube');
        }
        else {
            console.log('[PLAYER] Todo Bien!');
        }
    }, 5000);
    msg.channel.send(new discord_js_1["default"].MessageEmbed()
        .setAuthor(msg.author.username)
        .setDescription("\n                              ***Reproduciendo...***\n                              " + results[0].title + "\n\n                              De: **" + results[0].channelTitle + "**.\n\n                              Descripci\u00F3n: " + results[0].description + ".\n\n                              " + results[0].link + "\n                              ")
        .setColor("DARK_RED"));
    return dispatcher;
}
exports.playSong = playSong;
;
function YoutubeSearch(keywords) {
    return (0, youtube_search_1["default"])(keywords, { maxResults: 1, key: config_json_1["default"].API_KEY });
}
exports.YoutubeSearch = YoutubeSearch;
;
