const rp = require('request-promise');
module.exports.description = {
    name:"play",
    description:"Play sounds and music from YouTube in a voice channel. If a track is already playing, this adds it to the queue",
    usage: "`!play [video]",
    parameters: [
        {
            name:"video",
            description:"Link to a YouTube video to play"
        }
    ]
}