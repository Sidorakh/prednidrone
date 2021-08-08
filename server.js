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
        Intents.FLAGS.GUILD_MESSAGES,
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
    // if (interaction.commandName == 'setcommands') {
    //         try {
    //             // always allow Sidorakh#8297 in case of fuckup
    //             if (interaction.member.user.id != '141365209435471872') {
    //                 const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
    //                 const member = await interaction.guild.members.fetch(interaction.member.user.id);
    //                 if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.reply({ephemeral:true,content: 'You\'re not allowed to do that!'});
    //             }
    //             await interaction.defer({ephemeral:true});
    //             await setup(interaction.guild);
    //             await interaction.editReply({ephemeral:true,content:'Commands successfully updated!',});
    //         } catch(e) {
    //             await interaction.followUp({ephemeral:true,content:`An error occured: ${e.toString()}`});
    //         }
    //         return;
    // }

    if (slash[interaction.commandName] != undefined) {
        slash[interaction.commandName].command(interaction,client);
    }
})

client.on('messageCreate',async(msg)=>{
    if (msg.author.bot) return; // don't want to reply to itself
    //console.log(msg.content);
    if (msg.author.id == '141365209435471872') {
        if (msg.content=='!prednidrone setup') {
            if (msg.deletable) {
                await msg.delete()
            }
            const guild = msg.guild;
            if (guild) {
                //await setup(guild);
                await slash.update.setup(msg.guild);
            } else {
                msg.channel.send('not ready yet')
            }
        }
    }
});

client.on('guildMemberAdd',async (member)=>{
    let welcome_message = `Hey there <@${member.id}>! Welcome to joint point, the point of non-functional joint. Available roles: \n`;
    const collection = firebase.firestore().collection(process.env.COLLECTION);
    const roles = Object.keys((await collection.doc('roles').get()).data());
    welcome_message += roles.sort((a,b)=>a-b).map((v,i)=>`${i+1}. <@&${v}>`).join(`\n`) + '\nAssign roles by using the `/role add` command';

    /** @type {discord.TextChannel} */
    const welcome_channel = member.guild.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    await welcome_channel.send({
        content: welcome_message,
        allowedMentions: {parse:[]}
    });
    const {notify} = (await collection.doc('settings').get()).data();
    for (const id of notify) {
        (await member.guild.members.fetch(id)).send({
            content: `${member.displayName} has joined ${member.guild.name}`,
        });
    };
});