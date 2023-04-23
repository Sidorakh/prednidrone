import {ReactionMessage,ReactionSetup} from './reaction-message';
import {randomUUID as uuid} from 'crypto';
import * as discord from 'discord.js';
import client from '../discord-client';
import firebase from '../firebase';
import {ENVIRONMENT} from '../env';

const id_channel = new Map<string,string>();

export function start_reaction_roles(channel_id: string) {
    const id = uuid();
    id_channel.set(id,channel_id)
    return id;
}
export async function setup_reaction_roles(json: string,message: string, id: string) {
    const setup = JSON.parse(json) as ReactionSetup;
    const reaction_message: ReactionMessage = {
        message_id: null,
        reactions:[],
    }
    for (const role of setup.roles) {
        const guild = (client.guilds.resolve('218884270884782080') || client.guilds.resolve('484606200550260737'))!;
        const e = client.emojis.resolve(role.emoji_id);
        const r = guild.roles.resolve(role.role_id);

        if (e && r) {
            reaction_message.reactions.push({
                emoji_id: e.id,
                role_id: r.id,
                name: role.name,
            });
        }
    }
    const channel_id = id_channel.get(id);
    if (channel_id) {
        const channel = await client.channels.fetch(channel_id) as discord.TextBasedChannel;
        let str = message + '\n\n';
        for (const reaction of reaction_message.reactions) {
            const emoji = client.emojis.resolve(reaction.emoji_id);
            str += `${emoji} : ${reaction.name}\n`;
        }
        const msg = await channel.send(str);
        reaction_message.message_id = msg.id;
        
        for (const reaction of reaction_message.reactions) {
            await msg.react(reaction.emoji_id);
        }

        // and now to store it in Firebase
        const collection = `prednidrone${ENVIRONMENT=='DEV'?'-dev':''}`;
        await firebase.firestore().collection(collection).doc('reaction-messages').set({[msg.id]:reaction_message},{merge:true});
    }
}

export async function message_reaction_add(reaction: discord.MessageReaction | discord.PartialMessageReaction, user: discord.User | discord.PartialUser) {
    console.log('message_reaction_add')
    if (!reaction.message.inGuild()) return;    // nope

    const msg = reaction.message;
    
    // if it's not Pred then I don't care, saves db lookups
    if (msg.author.id != client.user!.id) {
        return;
    }
    // if it's not a custom emoji, then I don't care either
    if (!reaction.emoji.id) {
        return;
    }

    // and now to fetch
    const collection = `prednidrone${ENVIRONMENT=='DEV'?'-dev':''}`;
    const doc = await firebase.firestore().collection(collection).doc('reaction-messages').get();
    const data = doc.data() as {[key: string]:ReactionMessage | undefined};
    // somehow not here, fucking off
    if (!data) return;
    // message isn't here, fucking off
    if (data[msg.id] == undefined) return;
    
    if (data[msg.id]!.reactions.findIndex(v=>v.emoji_id == reaction.emoji.id) == -1) return;

    const role = data[msg.id]!.reactions.find(v=>v.emoji_id == reaction.emoji.id)!;

    const member = await msg.guild.members.fetch(user.id);

    try {
        await member.roles.add(role.role_id);
        //console.log(`Added ${role.name} role to ${member.displayName}`);
        user.send(`Added the ${role.name} role to you`);
    } catch(e) {
        //console.log(`Failed to add ${role.name} role to ${member.displayName}`)
        user.send(`Failed to add the ${role.name} role to you`);
    }
}

export async function message_reaction_remove(reaction: discord.MessageReaction | discord.PartialMessageReaction, user: discord.User | discord.PartialUser) {
    console.log('message_reaction_remove')
    if (!reaction.message.inGuild()) return;    // nope

    const msg = reaction.message;
    
    // if it's not Pred then I don't care, saves db lookups
    if (msg.author.id != client.user!.id) {
        return;
    }
    // if it's not a custom emoji, then I don't care either
    if (!reaction.emoji.id) {
        return;
    }

    // and now to fetch
    const collection = `prednidrone${ENVIRONMENT=='DEV'?'-dev':''}`;
    const doc = await firebase.firestore().collection(collection).doc('reaction-messages').get();
    const data = doc.data() as {[key: string]:ReactionMessage | undefined};
    // somehow not here, fucking off
    if (!data) return;
    // message isn't here, fucking off
    if (data[msg.id] == undefined) return;
    
    if (data[msg.id]!.reactions.findIndex(v=>v.emoji_id == reaction.emoji.id) == -1) return;

    const role = data[msg.id]!.reactions.find(v=>v.emoji_id == reaction.emoji.id)!;

    const member = await msg.guild.members.fetch(user.id);

    try {
        await member.roles.remove(role.role_id);
        //console.log(`Removed ${role.name} role from ${member.displayName}`);
        user.send(`Removed the ${role.name} role from you`);
    } catch(e) {
        //console.log(`Failed to remove ${role.name} role from ${member.displayName}`)
        user.send(`Couldn't remove the ${role.name} role from you`);
    }
}