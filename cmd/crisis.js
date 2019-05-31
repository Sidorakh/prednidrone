module.exports.description = {
    name:"crisis",
    description:"In case someoen needs urgent help. Misuse of this command falls under Rule 3.",
    usage: "!crisis [reason]",
    parameters: [
        {
            name:"reason",
            description:"Reason for the ping"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    let channel = msg.guild.channels.find(ch=>ch.name === 'crisis' && ch.type == 'text');
    channel.send(`Hey @everyone, <@${msg.author.id}> is pinging you in <#${msg.channel.id}> for ${args.join(' ')}`);
}