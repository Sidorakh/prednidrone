import * as env from './env';
import * as discord from 'discord.js';
import client from './discord-client';
import {get_config} from './bot-config';
import {initialise,interaction_handler} from './interactions';
import firebase, {initialise as initialise_firebase} from './firebase';
import {message_reaction_add,message_reaction_remove} from './services/reaction-roles';

client.login(env.DISCORD_TOKEN);

client.on('ready',async()=>{
    await initialise_firebase();
    console.log('Firebase initialised');

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

client.on('raw',async packet =>{
    if (!['MESSAGE_REACTION_ADD','MESSAGE_REACTION_REMOVE'].includes(packet.t)) return;
    //console.log(`Raw reaction add or remove`)
    let channel = await client.channels.fetch(packet.d.channel_id);
    // ealry exists
    if (!channel) return;
    if (!channel!.isTextBased()) return;

    // event will fire anyway
    if (channel!.isTextBased() && channel.messages.cache.has(packet.d.message_id)) return;

    const message = await channel.messages.fetch(packet.d.message_id);

    const emoji = packet.d.emoji.id ? `${packet.d.emoji.name}:${packet.d.emoji.id}` : packet.d.emoji.name;;
    const reaction = message.reactions.cache.get(emoji);

    const user = client.users.cache.get(packet.d.user_id)
    if (reaction && user) {

        // Enure use ris in collection
        reaction.users.cache.set(packet.d.user_id, user);
    
        // Fire the relevant event
        if (packet.t === 'MESSAGE_REACTION_ADD') {
            client.emit('messageReactionAdd', reaction, user);
        } else if (packet.t === 'MESSAGE_REACTION_REMOVE') {
            client.emit('messageReactionRemove', reaction, user);
        }
    }
});

client.on('messageReactionAdd',message_reaction_add);
client.on('messageReactionRemove',message_reaction_remove);
//client.on('messageDelete',)

client.on('guildMemberAdd',async(member)=>{
    const channel_id = await get_config('general') as string;
    const command_id = (await get_config('commands') as {[key:string]: string}).role;
    let welcome_message = `Hey there <@${member.id}>, welcome to our arthritis support commmunity! If you'd like to see what roles are available to you, run the </role list:${command_id}> command, and assign all the roles you need with </role add:${command_id}>. Feel free to join in on the chat and enjoy your stay!`;
    const channel = await client.channels.fetch(channel_id) as discord.TextBasedChannel;
    channel.send(welcome_message);
});