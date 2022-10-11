import * as env from './env';
import * as discord from 'discord.js';
import client from './discord-client';
import {get_config} from './bot-config';
import {initialise,interaction_handler} from './interactions';
import firebase, {initialise as initialise_firebase} from './firebase';

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

client.on('guildMemberAdd',async(member)=>{
    const channel_id = await get_config('general') as string;
    const command_id = (await get_config('commands') as {[key:string]: string}).role;
    let welcome_message = `Hey there <@${member.id}>, welcome to joint point, the point of non-functional joint! Run the </role:${command_id}> command to see what arthritis roles you can give yourself`;
    const channel = await client.channels.fetch(channel_id) as discord.TextBasedChannel;
    channel.send(welcome_message);
});