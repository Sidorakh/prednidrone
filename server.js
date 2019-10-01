// Main file

// Basic libraries
const fs = require('fs');
const path = require('path');
const discord = require('discord.js');
const rp = require('request-promise');
const shallow = require('./ss.js');
const audio = require('./audio.js')
const config = require('./config.json');
const client = new discord.Client();
const express = require('express');
const app = express();

let invite_map = {};
if (fs.existsSync('./invites.json')) {
    invite_map = JSON.parse(fs.readFileSync('./invites.json'));
}

console.log('Packages and Config loaded');

app.post('/signup', async function(req, res) { 
    
    var guild = client.guilds.array()[0];
    var channel = guild.channels.find(ch =>ch.name === 'announcements');
    var invite = await channel.createInvite({maxUses:2,maxAge:0,unqiue:true}, "Project Development Invite");

    var mod_channel = guild.channels.find(ch =>ch.name === 'mods-important');
    var fancy_message = {
        "embed": {
            "title": req.body.project_name,
            "description": `Type: ${req.body.project_type}\n${req.body.project_description}\n\n\nEmail them at \`${req.body.author_email}\` and include the following invite link if accepted: <https://discord.gg/${invite.code}>`,
            "color": 14492194,
            "timestamp": Date.now(),
            "footer": {
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png",
                "text": "This is an automatic message sent from Prednidrone with ❤"
            },
            "author": {
                "name": req.body.author_name,
                "icon_url": "https://cdn.discordapp.com/embed/avatars/0.png"
            }
        }
    }
    invite_map[invite.code] = 0;
    fs.writeFile("./invites.json",JSON.stringify(invite_map),()=>{console.log('File written')});
    mod_channel.send(fancy_message);
    //res.contentType('text/plain').send(`Your request has been received. The moderation team will contact you on ${req.body.author_email} soon`);
    res.redirect('https://sidorakh.xyz/thritis/application-received.html');
});

app.listen(3000);
console.log('Express server set up');

// Commands

let global = {};
global.cmd = {};
global.config = config;     // role list

let files = fs.readdirSync('./cmd/');
for (let i=0;i<files.length;i++) {
    let file = files[i];
    if (path.extname(file).toLowerCase() != '.js') {
        continue;
    } else {
        file = file.replace('.js','');
    }
    global.cmd[file] = require(`./cmd/${file}`);
    console.log(`${file}.js loaded successfully`);
}
client.on('ready',()=>{
    global.guild = client.guilds.first();
    global.cmd.remindme.init(global.guild);
});

const welcome_member = async (member)=>{
    let channel = member.guild.channels.find(ch => ch.name == 'general' && ch.type == 'text');
    let welcome_message = `Hey there, <@${member.id}>! Welcome to the joint point, the point of non functional joint!\n`
    welcome_message += `Select a role by typing \`!role number\`.\n`;
    for (let i=0;i<config.roles.length;i++) {
        welcome_message += `${i+1}. ${config.roles[i]}\n`;
    }
    welcome_message += "\nFor example  typing \`!role 1\` would give you the Osteoarthritis role";
    channel.send(welcome_message);
    let lemur = await member.guild.fetchMember('335117187411083275');
    lemur.send(`${member.displayName} has joined ${member.guild.name}`);
}

client.on('guildMemberAdd',async(member)=>{
    welcome_member(member);
});
client.on('error',console.error);
client.on('message',async(msg)=>{
    if (msg.content[0] != config.prefix) {
        shallow.buzz(msg.content);
        return;
    }
    let str = msg.content.substr(1);
    let [cmd,...args] = str.split(' ');
    cmd = cmd.toLowerCase();
    if (global.cmd[cmd] == undefined || global.cmd[cmd].call == undefined) {
        switch (cmd) {
            case 'play':
            case 'disconnect':
            case 'skip':
            case 'volume':
                    msg.channel.send(await audio[cmd](client,global,msg,args));
            break;
            default:
                return;
            break;
        }
    } else {
        let result = await global.cmd[cmd].call(client,global,msg,args);
        if (result != null) {
            msg.channel.send(result);
        }
    }
    if (msg.deletable) {
        msg.delete();
    }
});

client.login(config.token);
console.log('Ret-2-Go');
