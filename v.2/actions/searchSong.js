const YTSearch = require('youtube-search')
const config = require('../../config.json')

async function searchSong(query) {
    const results = await YTSearch(query, {
        key: config.API_KEY,
        maxResults: 1
    })

    return results.results[0]
}

module.exports = searchSong