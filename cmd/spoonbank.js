const fs = require('fs');
const path = require('path');
let accounts = JSON.parse(fs.readFileSync('./accounts.json'));

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
    let type = args[0]
    args.shift();
    switch (type) {
        case "signup": await spoonbank_signup(msg,args); break;
        case "balance": await spoonbank_balance(msg,args); break;
        case "send": await spoonbank_send(msg,args); break;
        case "give": await spoonbank_give(msg,args); break;
        case "help": 
        default:
            await spoonbank_help(msg,args); break;
    }
    fs.writeFile('accounts.json',JSON.stringify(accounts,null,4),(err)=>{
        if(err) return false;
        fs.readFile('accounts.json',(err,data)=>{
            if(err) return false;
            accounts = JSON.parse(data);
        });
    });
}


async function spoonbank_signup(msg,args) {
    let id = msg.author.id;
    if (args[0] != undefined) {
        id = args[0];
    }
    if (accounts[id] == undefined) {
        accounts[id] = {
            balance:500
        };
        msg.author.send('Signup complete. Welcome to Sidorakh\'s Spoonbank!');
    } else {
        msg.author.send('You\'ve already signed up!');
    }
}

async function spoonbank_balance(msg,args) {
    let id = msg.author.id;
    if (accounts[id] == undefined) {
        msg.author.send('You haven\'t signed up! Use `spoonbank signup` to create an account');
        return;
    }
    msg.author.send(`Your current balance: ${accounts[id].balance} spoons`)
}

async function spoonbank_send(msg,args) {
    let id = msg.author.id;
    let recipient = args[0].replace(/[<!@>]+/g,'');
    let amount = parseInt(args[1],10);
    if (isNaN(amount)) {
        msg.author.send('Syntax invalid - correct usage: `!spoonbank send @recipient amount [note]`');
        return;
    }
    args.shift();
    args.shift();
    console.log(args);
    let note = "";
    if (args.length > 0) {
        note = args.join(' ');
    }
    if (accounts[id] == undefined) {
        msg.author.send('You haven\'t signed up! Use `spoonbank signup` to create an account');
        return;
    }
    if (accounts[recipient] == undefined) {
        msg.author.send('The recipient doesn\'t have an account');
        return;
    }
    if (amount <= 0) {
        msg.author.send('You must enter an amount higher than 0!')
        return;
    }
    if (accounts[id].balance-amount < 0) {
        msg.author.send('You don\'t have enough spoons');
        return;
    }
    accounts[id].balance -= amount;
    accounts[recipient].balance += amount;
    try {
        let member = await msg.guild.fetchMember(recipient);
        msg.author.send(`You have sent ${member.displayName} ${amount} ${(amount == 1) ? "spoon" : "spoons"}`);
        let message = `${msg.member.displayName} has sent you ${amount} spoons`;
        if (note != "") {
            message += `\n`;
            message += `Note: ${note}`
        }
        member.send(message);

    } catch (e) {
        console.error(e);
    }
}

async function spoonbank_give(msg, args) {
    if (msg.author.id != '141365209435471872') {
        return false;
    }
    let recipient = args[0].replace(/[<!@>]+/g,'');
    let amount = parseInt(args[1],10);
    if (isNaN(amount)) {
        msg.author.send('Non-integer amount passed');
        return;
    }
    if (accounts[recipient] == undefined) {
        msg.author.send('The recipient doesn\'t have an account');
        return;
    }
    accounts[recipient].balance += amount;
}

async function spoonbank_help(msg, args) {
    let message = `Welcome to **Sidorakh's Spoon Bank!**\n`;
    message += `Type \`!spoonbank signup\` in any channel to get started`;
    message += `To send someone spoons, type \`!spoonbank send @someone amount\`. For example, \`!spoonbank send @Sidorakh#8297 50\` would send Sidorakh 50 spoons\n`;
    message += `To check your current spoon balance, use \`!spoonbank balance\`\n`;
    message += `To see this message, use \`!spoonbank help\`\n`;
    msg.author.send(message);
}

/*
module.exports.page = async(page,data) => {
    let new_page = "";
    switch (page) {
        case "list":
            new_page = list_users(template,data);
        break;
    }
    return new_page;
}

async function list_users(template,args) {
    
    let page = template;
    let user_list = Object.keys(accounts);
    let list = "";
    for (let i=0;i<user_list.length;i++) {
        let member = await guild.fetchMember(user_list[i]);
        let url = member.user.displayAvatarURL;
        let name = member.displayName;
        let item = page_elements.list_item.replace('{{ICON_URL}}',url).replace('{{PERSON_NAME}}',name);
        list += item + "\n";

    }
    let body = page_elements.list_main.replace("{{LIST_ITEMS}}", list);
    page = page.replace("{{PAGE_CONTENT}}",body);
    return page;
}
*/