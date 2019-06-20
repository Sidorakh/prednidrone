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
console.log('Packages and Config loaded');

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
});
client.on('guildMemberAdd',async(member)=>{
    let channel = member.guild.channels.find(ch => ch.name == 'general' && ch.type == 'text');
    let welcome_message = `Welcome to the server, <@${member.id}>!\n`
    for (let i=0;i<config.roles.length;i++) {
        welcome_message += `${i+1}. ${config.roles[i]}\n`;
    }
    welcome_message += `Select a role by typing \`!role number\`.\nFor example  typing \`!role 1\` would give you the Osteoarthritis role`;
    channel.send(welcome_message);
    let lemur = await member.guild.fetchMember('335117187411083275');
    lemur.send(`${member.displayName} has joined ${member.guild.name}`);
});
client.on('error',console.error);
client.on('message',async(msg)=>{
    if (msg.content[0] != config.prefix) {
        shallow.buzz(msg.content);
    }
    let str = msg.content.substr(1);
    let [cmd,...args] = str.split(' ');
    cmd = cmd.toLowerCase();
    if (global.cmd[cmd] == undefined) {
        if (cmd == 'join') {
            audio.join(msg);
        } else {
            return;
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