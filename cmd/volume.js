const rp = require('request-promise');
module.exports.description = {
    name:"volume",
    description:"Sets the volume of playback",
    usage: "`!volume [amount]`",
    parameters: [
        {
            name:'amount',
            description:'The playback volume (0-100). Lower is usually better'
        }
    ]
}