module.exports.description = {
    name:"help",
    description:"Displays help text for the specified command, or a list of all commands if none is specified",
    usage:"`!help [command]` or `!help`",
    parameters:[
        {
            name:"command",
            description:"(Optional) Which command information will be shown for"
        }
    ]
}
module.exports.call = async (client,global,msg,command) => {
    let timestamp = new Date(Date.now());
    if (command[0]) {
        command = command[0].toLowerCase();
        if (global.cmd[command]) {
            let cmd = global.cmd[command].description;
            let f = [];
            if (cmd.parameters) {
                for (let i=0;i<cmd.parameters.length;i++) {
                    f[i] = {
                        name:cmd.parameters[i].name,
                        value:cmd.parameters[i].description
                    };
                }
            }
            let data =  {
                embed:{
                    author:{
                        name:`${global.config.prefix}${command}`
                    },
                    description:`**${cmd.name}:** ${cmd.description}\n**Usage:** ${cmd.usage}`,
                    color: 8387666,
                    timestamp: timestamp.toISOString(),
                    fields:f
                }
            }
            msg.author.send(data);
            return "";
        } else {
            msg.author.send(`Command ${command} was not found. Type \`!help\` for a list of commands`);
            return "";
        }
    } else {
        let command_list = Object.keys(global.cmd);
        let f = [];
        for (let i=0;i<command_list.length;i++) {
            f[i] = {name:`\`${command_list[i]}\``,value:global.cmd[command_list[i]].description.description};
        }
        let data =  {
            content:'The available commands are as follows',
            embed:{
                author:{
                    name:`Prednidrone`
                },
                color: 8387666,
                timestamp: timestamp.toISOString(),
                fields:f
            }
        }
        console.log(JSON.stringify(data,null,4));
        await msg.author.send(data);
        return "";
    }
}