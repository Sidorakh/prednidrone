const MODERATION_LOG_CHANNEL_ID = '496929301120155658';

import * as discord from 'discord.js';
import {MessageContextMenuInteraction} from '../interaction-typedefs';
export const command: MessageContextMenuInteraction = {
    description: 'MessageContextMenuCommand',
    command: new discord.ContextMenuCommandBuilder().setType(discord.ApplicationCommandType.Message)
                                                    .setName('Delete and forward message'),
    async handler(interaction: discord.MessageContextMenuCommandInteraction) {
        await interaction.deferReply({ephemeral:true});
        if (!interaction.inGuild() || interaction.guild === null) {
            await interaction.editReply({content: 'You must use this command in a guild'});
            return;
        }
        const member = await interaction.guild.members.fetch(interaction.targetMessage.author.id);
        await interaction.editReply({content: 'Message sent'});

        const moderation_log = await interaction.client.channels.fetch(MODERATION_LOG_CHANNEL_ID) as discord.TextChannel | null;
        if (moderation_log === null) {
            interaction.editReply(`Moderation log not found, pls fix`);
            return;
        }
        const msg = await interaction.targetMessage.fetch();
        let ref_txt = '';
        if (msg.reference) {
            if (msg.reference.type == discord.MessageReferenceType.Default) {
                // it's a reply
                ref_txt = `Reply to: https://discord.com/channels/${msg.reference.guildId}/${msg.reference.channelId}/${msg.reference.messageId}`;
            } else {
                // it's a forward
                ref_txt = `Message forwarded from: https://discord.com/channels/${msg.reference.guildId}/${msg.reference.channelId}/${msg.reference.messageId}`
            }
        }
        const fwd = await msg.forward(moderation_log);
        const content = `Message removed:`
                    + `\nAuthor: <@${msg.author.id}> | \`${msg.author.id}\``
                    + ref_txt
                    + `\nSent at: <t:${Math.floor(msg.createdTimestamp/1000)}:F>`
                    + `\nRemoved from: <#${interaction.channelId}>`
                    + `\nRemoved by: <@${interaction.user.id}> | \`${interaction.user.id}\``;
        await fwd.reply({content,allowedMentions: {parse: []}});
        
        await msg.delete();
        await interaction.editReply({content: 'Message sent and original message deleted'});
    }
}