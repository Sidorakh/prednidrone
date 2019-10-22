require('dotenv').config();
import * as discord from 'discord.js' 
import * as express from 'express';
import * as rp from 'request-promise';
import * as sqlite3_i from 'sqlite3';
import {config} from './config'
import {DatabaseHelper} from './database-helper';
import {Services} from './ancillary';

const sqlite3 = sqlite3_i.verbose();
const db = new sqlite3.Database("prednidrone.db");
const dbh = new DatabaseHelper(db);
db.serialize(async ()=>{
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Spoons (
        DiscordID TEXT NOT NULL PRIMARY KEY,
        Balance INTEGER
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Medicine (
        DiscordID TEXT NOT NULL PRIMARY KEY,
        MedicineList TEXT
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Conditions (
        DiscordID TEXT NOT NULL PRIMARY KEY,
        ConditionList TEXT
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS ShallowTerms (
        TermID INTEGER PRIMARY KEY AUTOINCREMENT,
        Term TEXT
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS ShallowsServices (
        DiscordID TEXT NOT NULL PRIMARY KEY
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Transactions (
        SenderID TEXT NOT NULL,
        RecipientID TEXT NOT NULL,
        Amount INTEGER NOT NULL,
        Reason TEXT,
        Time TEXT,
        FOREIGN KEY(SenderID) REFERENCES Spoons(DiscordID),
        FOREIGN KEY(RecipientID) REFERENCES Spoons(DiscordID)
    )`);
    await dbh.run(`CREATE TABLE IF NOT EXISTS ChannelHosts (
        DiscordID TEXT NOT NULL,
        ChannelID TEXT NOT NULL,
        PRIMARY KEY (DiscordID, ChannelID)
    )`);
});
const client: discord.Client = new discord.Client();

client.on('guildMemberAdd',async(member)=>{
    const channel:discord.TextChannel = <discord.TextChannel> member.guild.channels.find(ch => (ch.name==="general" && ch.type==="text") );
    let welcome_message:String = `Hey there <@${member.id}>! Welcome to joint point, the point of non-functional joint\n`;
    let i=1;
    for (const role of config.roles) {
        welcome_message += `${i++}. ${role}\n`;
    }
    welcome_message += `\nSelect a role by typing \`!role number\`.\n`;
    welcome_message += `For example, typing \`role 1\` would give you the Osteoarthritis role`;
    channel.send(welcome_message);
    const lemur: discord.GuildMember = await member.guild.fetchMember('335117187411083275');
    lemur.send(`${member.displayName} has joined ${member.guild.name}`);
});

client.on('message',(msg)=>{
    console.log(msg.content);
});

const services = new Services(dbh,async (id:string):Promise<string[] | Error> =>{
    const guild: discord.Guild = client.guilds.first();
    const user = await client.fetchUser(id);
    if (user) {
        const member = await guild.fetchMember(user);
        if (member) {
            const roles = [];
            const role_array = member.roles.array();
            for (let i=0;i<role_array.length;i++) {
                const role = role_array[i];
                roles.push(role.name);
            }
            return roles;
        }
    }
    return new Error("User not in guild");
},process.env.PORT,async (id: string):Promise<discord.User|Error>=>{
    const user = await client.fetchUser(id);
    return user;
});

client.login(process.env.TOKEN);