import discord, { SendableChannelTypes } from 'discord.js';
import client from '../discord-client';
import fs from 'fs';
import { get_config } from '../bot-config';

interface MessageMetadata {
    author: string;
    content: string;
    attachments: string[];
    suspicion: number;
    messages: number;
    channels: Set<string>;
    time: number;
    report_post: null | discord.Message;
}

const ONE_SECOND = 1000;
const ONE_MINUTE = ONE_SECOND * 60;

let snitch_thread: null | discord.TextChannel | discord.ThreadChannel;

async function get_snitch_thread() {
    if (snitch_thread == null) {
        const t =  await client.channels.fetch(await get_config('snitch_thread')) as discord.TextChannel | discord.ThreadChannel | null;
        snitch_thread = t;
    }
    return snitch_thread;
}

const messages = new Map<string,MessageMetadata>();

export default async function on_message(msg: discord.Message) {
    if (msg.author.bot) return;
    const user_id = msg.author.id;
    const logged_msg = messages.get(user_id);
    let msg_data: discord.Message | discord.MessageSnapshot = msg;
    if (msg.reference?.type == discord.MessageReferenceType.Forward) {
        msg_data = msg.messageSnapshots.first()!;
    }
    let check = true;
    if (logged_msg && (logged_msg.time + ONE_MINUTE*2) < msg.createdTimestamp) {
        check = false;
    }

    let action = false;
    let demerits = [];
    if (logged_msg && check) {
        if (logged_msg.content == msg_data.content) {
            demerits.push('Matching content');
        }
        if (logged_msg.attachments.length == msg_data.attachments.size && msg_data.attachments.size > 0) {
            demerits.push('Equal number of attachments');
            const attachments = msg_data.attachments.values();
            let num = 0;
            for (const file of attachments) {
                if (logged_msg.attachments.includes(file.name)) {
                    num += 1;
                }
            }
            if (num == logged_msg.attachments.length) {
                demerits.push('Similar attachment names');
            }
        }
        if (msg.createdTimestamp.valueOf() < (logged_msg.time + (ONE_SECOND * 10))) {
            demerits.push('Within ten seconds')
        }

        
        if (demerits.length > 1) {
            logged_msg.suspicion += 1
            logged_msg.messages += 1;
            logged_msg.channels.add(msg.channel.id);
            messages.set(user_id,logged_msg);
            if (logged_msg.channels.size > 1 && logged_msg) {
                const description =   `Author: <@${user_id}> | \`${user_id}\`\n`
                                + `Number of suspicious messages: ${logged_msg.messages}\n`
                                + `In channels: ${[...logged_msg.channels.values()].map(v=>`<#${v}>`).join(', ')}\n`
                                + `Demerits: \n${demerits.map(v=>`- ${v}`).join('\n')}\n`
                                + `Latest message: ${msg.url}`;
                const embed = new discord.EmbedBuilder().setTitle('Potential spam message detected').setDescription(description);
                if (logged_msg!.report_post == null) {
                    const thread = await get_snitch_thread();
                    const snitch_msg = await thread!.send({embeds:[embed]});
                    logged_msg.report_post = snitch_msg;
                } else {
                    logged_msg.report_post.edit({embeds: [embed]});
                }
            }
        } else {
            let meets_attachment_heuristic = msg_data.attachments.size > 0 && msg_data.attachments.some(v=>v.contentType?.startsWith('image'));
            let meets_invite_heuristic = msg_data.content.includes('.gg/') || msg_data.content.includes(`discord.com/invite/`) || msg_data.content.includes('discordapp.com/invite/');
            let meets_link_heuristic = msg_data.content.includes('http://') || msg_data.content.includes('https://');

            if (meets_attachment_heuristic || meets_invite_heuristic || meets_link_heuristic) {
                    messages.set(user_id,{
                    attachments: [...msg_data.attachments.values()].map(v=>v.name),
                    author: user_id,
                    content: msg_data.content,
                    time: msg.createdTimestamp,
                    suspicion: 0,
                    messages: 1,
                    channels: new Set<string>([msg.channel.id]),
                    report_post: null,
                });
            } else {
                // A malicious message *usually* meets oen of these heuruistics, if it's not caught by otehr filters
            }
        }
    }
}


