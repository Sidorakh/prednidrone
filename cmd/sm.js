
module.exports.description = {
    name:"sm",
    description:"Hide a specified channel for yourself",
    usage: "`!sm [channel]`, or `!sm [channel] [reason]`",
    parameters: [
        {
            name:"channel",
            description:"Channel to mute"
        },
        {
            name:"reason",
            description:"(Optional) Reason"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    if (!msg.guild) {
        // it can't be a DM AFAIK
        msg.channel.send('You must use the `sm` command in the server');
        return null;
    }
    let channel;
    if (args.length > 0) {
        channel = msg.guild.channels.find(ch=> ch.id==args[0].replace(/<|#|>/g,''));
        if (channel) {
            channel.overwritePermissions(msg.author,{VIEW_CHANNEL:false},'Request on behalf of user');
        }
        let reason = '';
        if (args.length > 1) {
            reason = args.slice(1,args.length).join(' ');
        }
        if (global.muted[msg.author.id] == undefined) {
            global.muted[msg.author.id] = [];
        }
        global.muted[msg.author.id].push(channel);
        global.save_data('./muted.json',global.muted);
        let mod_channel = msg.guild.channels.find(ch=>ch.name=='mod-important' & ch.type=='text');
        mod_channel.send(`<@${msg.author.id}> muted <#${args[0].replace(/<|#|>/g,'')}> ${(reason != '' ? 'due to ' + reason : '')}`);
    }
    return null;
}