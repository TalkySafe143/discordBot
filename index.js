"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
exports.__esModule = true;
var Discord = __importStar(require("discord.js"));
var config_json_1 = __importDefault(require("./config.json"));
var client = new Discord.Client();
var myPlayer = __importStar(require("./components/player"));
var queue_1 = require("./queue");
var ActualDispatcher;
var isSpeaking;
var queue = new queue_1.Cola();
var ActualConnection;
var alreadyFinish = false;
client.on("ready", function () {
    console.log("Logeado con este user " + client.user.tag);
});
client.on("message", function (msg) { return __awaiter(void 0, void 0, void 0, function () {
    var message, command, params;
    return __generator(this, function (_a) {
        if (!msg.content.startsWith(config_json_1["default"].PREFIX))
            return [2 /*return*/];
        message = msg.content.split(" ");
        command = message.shift();
        params = message.join(" ");
        switch (command) {
            case "$play":
                console.log('[INDEX] Entro al comando Play');
                if (!msg.member.voice.channel) {
                    msg.reply("Primero tienes que estar en un canal de voz! :confused:");
                    return [2 /*return*/];
                }
                console.log("[INDEX] ActualDispatcher ya tiene valor? " + (ActualDispatcher !== undefined));
                console.log("[INDEX] Este es el valor de isSpeaking antes de entrar a la funcion: " + isSpeaking);
                myPlayer.YoutubeSearch(params)
                    .then(function (results) { return __awaiter(void 0, void 0, void 0, function () {
                    var connection;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0:
                                queue.enqueue(results.results[0].link);
                                console.log(queue);
                                debugger;
                                if (!(isSpeaking === undefined)) return [3 /*break*/, 2];
                                console.log('[INDEX] Entro al If que no tiene cola');
                                return [4 /*yield*/, msg.member.voice.channel.join()];
                            case 1:
                                connection = _a.sent();
                                ActualConnection = connection;
                                ActualDispatcher = myPlayer.playSong(connection, queue.dequeue().value, msg, results.results);
                                ActualDispatcher.on('speaking', function (speaking) {
                                    if (isSpeaking)
                                        return;
                                    console.log('Entro al evento SPEAKING (sin cola), osea, seteo el valor.');
                                    isSpeaking = speaking;
                                    alreadyFinish = false;
                                });
                                return [3 /*break*/, 3];
                            case 2:
                                if (isSpeaking === 1) {
                                    console.log('[INDEX] Entro al If que si tiene cola');
                                    msg.channel.send(new Discord.MessageEmbed()
                                        .setAuthor(msg.author.username)
                                        .setColor('DARK_RED')
                                        .setDescription("\n                                            ***\u00A1A\u00D1ADIDO A LA COLA!***\n                                            " + results.results[0].title + "\n\n                                            De: **" + results.results[0].channelTitle + "**.\n                                            "));
                                    ActualDispatcher.on('finish', function () {
                                        if (!alreadyFinish) {
                                            alreadyFinish = true;
                                            console.log('[INDEX] Ya he terminado de reporducir!');
                                            ActualDispatcher = myPlayer.playSong(ActualConnection, queue.dequeue().value, msg, results.results);
                                            debugger;
                                        }
                                        console.log('[INDEX] Ya he terminado, pero no entre a la reproduccion!');
                                    });
                                    ActualDispatcher.on('speaking', function (speaking) {
                                        if (isSpeaking)
                                            return;
                                        console.log('Entro al evento SPEAKING (cola), osea, seteo el valor.');
                                        isSpeaking = speaking;
                                        alreadyFinish = false;
                                    });
                                }
                                _a.label = 3;
                            case 3: return [2 /*return*/];
                        }
                    });
                }); })["catch"](function (error) {
                    msg.react('💨');
                    msg.reply('Ups! Algo salió mal con la busqueda.');
                    console.log(error);
                });
                break;
            case "$help":
                msg.channel.send(new Discord.MessageEmbed()
                    .setAuthor('Botsito de Galindo')
                    .setColor('BLUE')
                    .setDescription("\n                            En este mensaje te voy a indicar todos los comandos que tengo disponible con sus funcionalidades. ***Si quieres fija este mensaje***\n\n                            *Todos los comandos van con el sufijo: '$'* Ejemplo: $play Esclava Remix\n\n                            > *play <NOMBRE DE LA CANCION>* - Permite reproducir canciones por medio de Youtube.\n                        "));
                break;
            case "$estasConectado":
                msg.guild.voice !== undefined ? msg.reply("Si") : msg.reply("No");
                break;
            default:
                msg.react('😭');
                msg.reply('Lo siento, creo que el comando que tratas de enviar no esta en mi lista de comandos! :confused:');
                break;
        }
        return [2 /*return*/];
    });
}); });
client.on("guildCreate", function (guild) {
    var date = new Date();
    var channelToSend, now;
    if (date.getHours() <= 7 && date.getHours() >= 0)
        now = "¡Buenos días! ¿O madrugada?";
    else if (date.getHours() > 7 && date.getHours() <= 12)
        now = "¡Buenos días!";
    else if (date.getHours() > 12 && date.getHours() <= 18)
        now = "¡Buenas tardes!";
    else if (date.getHours() > 18 && date.getHours() < 24)
        now = "¡Buenas noches!";
    guild.channels.cache.forEach(function (channel) {
        if (channel.type === "text" && !channelToSend)
            channelToSend = channel;
    });
    channelToSend.send(new Discord.MessageEmbed()
        .setAuthor(guild.name, guild.iconURL({ dynamic: true }))
        .setDescription("\n                **" + now + ", me alegro que me hayas agregado a tu servidor!:moyai:**\n\n                En este mensaje te voy a indicar todos los comandos que tengo disponible con sus funcionalidades. ***Si quieres fija este mensaje***\n\n                *Todos los comandos van con el sufijo: '$'* Ejemplo: $play Esclava Remix\n\n                > *play <NOMBRE DE LA CANCION>* - Permite reproducir canciones por medio de Youtube.\n            ")
        .setColor("GREEN"));
});
client.login(config_json_1["default"].TOKEN);
