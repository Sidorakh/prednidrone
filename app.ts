import * as env from './env';
import * as discord from 'discord.js';
import client from './discord-client';
import {get_config} from './bot-config';
import {initialise,interaction_handler} from './interactions';
//import firebase, {initialise as initialise_firebase} from './firebase';
//import {message_reaction_add,message_reaction_remove} from './services/reaction-roles';
import { ApplicationCommand } from './db';
import spam_detector from './services/spam-detector';
import owie_reactor from './services/owie-reactor';

client.login(env.DISCORD_TOKEN);

client.on('clientReady',async()=>{
    //await initialise_firebase();
    //console.log('Firebase initialised');

    await initialise();
    console.log('Commands initialised');
    console.log('Ret-2-Go!');
});

client.on('interactionCreate',async (interaction)=>{
    try {
        await interaction_handler(interaction);
    } catch(e) {
        console.error(e);
    }
});

//client.on('messageReactionAdd',message_reaction_add);
//client.on('messageReactionRemove',message_reaction_remove);
//client.on('messageDelete',)

client.on('messageCreate',async(msg)=>{
    //console.log(msg.content);

    await spam_detector(msg);
    await owie_reactor(msg);

    
});

client.on('guildMemberAdd',async(member)=>{
    const channel_id = await get_config('general');
    const command_id = (await ApplicationCommand.findOne({where: {name: 'role'}}))?.get().id;
    let welcome_message = `Hey there <@${member.id}>, welcome to our arthritis support commmunity! If you'd like to see what roles are available to you, run the </role list:${command_id}> command, and assign all the roles you need with </role add:${command_id}>. Feel free to join in on the chat and enjoy your stay!`;
    const channel = await client.channels.fetch(channel_id) as discord.SendableChannels;
    channel.send(welcome_message);
});