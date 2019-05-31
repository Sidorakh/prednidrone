module.exports.description = {
    name:"poll",
    description:"Start a poll - pass in the question and options enclosed in double quotes - \"\"",
    usage: "`!poll \"question\" \"\"`",
    parameters: [
        {
            name:"",
            description:""
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    let options = (args.join(' ') + ' ').split('" ').map( x=> x.replace('"','')).filter(x => x.length > 0);
    let question = options.shift();
    let number = ['0⃣','1⃣','2⃣','3⃣','4⃣','5⃣','6⃣','7⃣','8⃣','9⃣','10⃣']; 
    let txt = `<@${msg.author.id}> asks...\n${question}\n`;
    for (let i=0;i<options.length;i++) {
        txt += `${number[i+1]}. ${options[i]}\n`;
    }
    let new_msg = await msg.channel.send(txt);
    for (let i=0;i<options.length;i++) {
        await new_msg.react(number[i+1]);
    }
    return undefined;
}