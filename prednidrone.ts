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
        DiscordID PRIMARY KEY INTEGER NOT NULL,
        Balance INTEGER
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Medicine (
        DiscordID PRIMARY KEY INTEGER NOT NULL,
        MedicineList TEXT
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS Conditions (
        DiscordID PRIMARY KEY INTEGER NOT NULL,
        ConditionList TEXT
    )`);
    await dbh.run(`
    CREATE TABLE IF NOT EXISTS ShallowTerms (
        TermID PRIMARY KEY INTEGER AUTOINCREMENT,
        Term TEXT
    )`);
    
});

const client: discord.Client = new discord.Client();

client.on('guildMemberAdd',async(member)=>{
    const channel:discord.TextChannel = <discord.TextChannel> member.guild.channels.find(ch => (ch.name=="general" && ch.type=="text") );
    let welcome_message:String = `Hey there <@${member.id}>! Welcoem to joint point, the point of non-functional joint\n`;
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

});


