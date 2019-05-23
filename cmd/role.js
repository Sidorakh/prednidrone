module.exports.description = {
    name:"role",
    description:"Applies specified role to the user, or lists available roles",
    usage: "`!role [number]` or `!role list`",
    parameters: [
        {
            name: "role",
            description: "Either a number (as shown when using `!role list` or in the welcome message) or `list`"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    if (isNaN(Number(args[0]))) {
        if (args[0] == 'list') {
            let role_msg = "";
            for (let i=0;i<global.config.roles.length;i++) {
                role_msg += `${i+1}. ${global.config.roles[i]}\n`;
            } 
            return role_msg;
        }
    }
    let role = Number(args[0]);
    let role_str = global.config.roles[role-1];
    let new_role = msg.guild.roles.find(rl=>rl.name===role_str);

    if (new_role) {
        if (msg.member.roles.find(rl=>rl.name===role_str)) {
            msg.member.removeRole(new_role);
        } else {
            msg.member.addRole(new_role);
        }
    } else {
        return `Role number ${args[0]} not found`;
    }
}