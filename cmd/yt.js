const rp = require('request-promise');
module.exports.description = {
    name:"yt",
    description:"Search YouTube for a video",
    usage: "`!yt [query]",
    parameters: [
        {
            name:"query",
            description:"What to search YouTube for"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    let result = JSON.parse(await rp(`${global.config.search}?query=${args.join('+')}`));
    // /console.log(JSON.stringify(result,null,4));
    if (result.items.length > 0) {
        return `https://youtube.com/watch?v=${result.items[0].id.videoId}`;
    } else {
        return `No videos found for the term \`${args.join(' ')}\``;
    }
}