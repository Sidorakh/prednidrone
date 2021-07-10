require('dotenv').config();

const discord = require('discord.js');
const {default: axios} = require('axios');
const {default: firebase} = require('firebase');

const {Intents} = discord;

const {setup} = require('./command-setup');
const slash = require('./slash');

firebase.initializeApp(require('./firebase-credentials.json'));
firebase.auth().signInWithEmailAndPassword(process.env.FIREBASE_EMAIL,process.env.FIREBASE_PASSWORD);

const client = new discord.Client({
    intents: [
        Intents.FLAGS.GUILDS,
        Intents.FLAGS.GUILD_BANS,
        Intents.FLAGS.GUILD_MEMBERS,
        Intents.FLAGS.DIRECT_MESSAGES,
        Intents.FLAGS.GUILD_MESSAGES
    ],
    partials: ['MESSAGE','CHANNEL']
});

client.login(process.env.TOKEN);

client.once('ready',()=>{
    console.log('Ret-2-Go!');
});

client.on('interactionCreate',async interaction =>{
    if (!interaction.isCommand()) return;
    let cmd = null;
    switch (interaction.commandName) {
        case 'setcommands':
            try {
                // always allow Sidorakh#8297 in case of fuckup
                if (interaction.member.user.id != '141365209435471872') {
                    const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
                    const member = await interaction.guild.members.fetch(interaction.member.user.id);
                    if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.reply({ephemeral:true,content: 'You\'re not allowed to do that!'});
                }
                await interaction.defer({ephemeral:true});
                await setup(interaction.guild);
                await interaction.editReply({ephemeral:true,content:'Commands successfully updated!',});
            } catch(e) {
                await interaction.followUp({ephemeral:true,content:`An error occured: ${e.toString()}`});
            }
        break;
        case 'role':
            cmd = slash.role;
        break;
        case 'lifetime':
            cmd = slash.lifetime;
        break;
        case 'say':
            cmd = slash.say;
        break;
        case 'badrheumy':
            cmd = slash.badrheumy;
        break;
        case 'crisis':
            cmd = slash.crisis;
        break;
        case 'update':
            cmd = slash.update;
        break;
        case 'pronoun':
            cmd = slash.pronoun;
        break;
    }

    if (cmd != null) {
        cmd.command(interaction,client);
    }
})

client.on('messageCreate',async(msg)=>{
    if (msg.author.bot) return; // don't want to reply to itself
    //console.log(msg.content);
    if (msg.author.id == '141365209435471872') {
        if (msg.content=='$prednidrone setup') {
            if (msg.deletable) {
                await msg.delete()
            }
            const guild = msg.guild;
            if (guild) {
                await setup(guild);
            } else {
                msg.channel.send('not ready yet')
            }
        }
    }
});