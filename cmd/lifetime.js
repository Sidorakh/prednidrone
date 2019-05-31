module.exports.description = {
    name: "lifetime",
    description:"Displays the time a member joined the server",
    usage:"`!lifetime [Member]`",
    parameters: [
        {
            name:"user",
            description:"Member (or ID) to check - if blank, checks the message sender"
        }
    ]
}

module.exports.call = async(client,global,msg,args)=>{
    if (msg.guild == undefined) {
        return `You can only use \`!lifetime\` in a server`;
    }
    if (args.length == 0) {
        return `${msg.member.displayName}, you have been a member of this Discord server since ${msg.member.joinedAt}`;
    } else {
        let member = await msg.guild.fetchMember(args[0].replace(/[<!@>]+/g,''));
        return `${member.displayName} has been a member of this server since ${member.joinedAt}`;
    }
}