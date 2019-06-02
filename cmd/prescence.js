module.exports.description = {
    name:"prescence",
    description:"Set values for Discord's Rich PRescence API (the playing/watching/listening statuses)",
    usage: "`!prescence [type] [media]",
    parameters: [
        {
            name:"type",
            description: "The type of activity - playing, watching, or listening"
        },
        {
            name:"media",
            description: "What the media in question is"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    if (args.length <= 1) {
        client.user.setActivity(null);
    } else {
        let type = args.shift().toUpperCase();
        if (type == "PLAYING" || type == "WATCHING" || type == "LISTENING") {
            let media = args.join(' ');
            if (media.length > 0) {
                client.user.setActivity(media,{type: type});
            }
        }
    }
}