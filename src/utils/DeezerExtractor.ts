import {BaseExtractor, Track} from 'discord-player'

export class DeezerExtractor extends BaseExtractor {

    static indentifier = 'bbb7cc1efb64c2fe01fffcca2fa1553e12ab79c9' as const;

    public createBridgeQuery = (track: Track) => `${track.title} by ${track.author} official audio`;



}