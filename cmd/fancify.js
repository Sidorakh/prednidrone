const lut = require('./fancify.json');
const upper = lut.alphabet[0];
const lower = lut.alphabet[1];

module.exports.description = {
    name: "fancify",
    description:"Makes text fancy",
    usage:"`!fancify TYPE text`",
    parameters: [
        {
            name:"type",
            description:"yeolde | cursive | stroke | australian"
        },
        {
            name: "message",
            description: "String to fancify"
        }
    ]
}

module.exports.call = async(client,global,msg,args)=>{
    let type = args.shift().toLowerCase();
    if (lut[type] != undefined) {
        let new_msg = "";
        args.join(' ').split('').forEach(c=>{
            let lookup = lut[type];
            if (upper.indexOf(c) != -1) {
                new_msg += lookup[0][lower.indexOf(c)];
            } else if (lower.indexOf(c) != -1) {
                new_msg += lookup[1][lower.indexOf(c)];
            } else {
                new_msg += c;
            }
        });
        if (type == "australian") {
            new_msg = new_msg.split('').reverse().join('');
        }
        return new_msg;
    } else {
        msg.author.send(`${type} is not a valid type`);
        return "";
    }

}