import * as env from './env';
import * as discord from 'discord.js';
import client from './discord-client';
import {initialise,interaction_handler} from './interactions';
import firebase, {initialise as initialise_firebase} from './firebase';

client.login(env.DISCORD_TOKEN);

client.on('ready',async()=>{
    await initialise_firebase();
    await initialise();
    console.log('Ret-2-Go!');
});

client.on('interactionCreate',(interaction)=>{
    interaction_handler(interaction);
});

client.on('guildMemberAdd',(member)=>{
    let welcome_message = `Hey there <@${member.id}>! Welcome to joint point, the point of non-functional joint. Run the /role command to see what roles you can give yourself`
})