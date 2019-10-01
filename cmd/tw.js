module.exports.description = {
    name:"say",
    description:"Make the bot say words!",
    usage: "`!say words`",
    parameters: [
        {
            name:"words",
            description:"What the bot should say"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    return args.join(' ');
}