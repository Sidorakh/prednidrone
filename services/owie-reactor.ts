import discord from 'discord.js';
import client from '../discord-client';
import { get_config } from '../bot-config';
export default async function on_message(msg: discord.Message) {
    try {
        if (['ouch','owie'].includes(msg.content.toLowerCase().replace(/\.|\!/,''))) {
            const id = await get_config('same_id');
            if (id != 'null') {
                msg.react(id);
            }
        }
    } catch(e) {
        
    }
}