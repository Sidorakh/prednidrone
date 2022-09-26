import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('say')
                                                .setDescription('Make the bot say words')
                                                .addStringOption(v=>v.setName('message').setDescription('Message to send').setRequired(true))
                                                .addChannelOption(v=>v.setName('channel').setDescription('Channel to send message in').addChannelTypes(discord.ChannelType.GuildText,discord.ChannelType.PublicThread,discord.ChannelType.PrivateThread,discord.ChannelType.GuildAnnouncement,discord.ChannelType.AnnouncementThread)),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const channel = (interaction.options.getChannel('channel') || interaction.channel) as discord.TextBasedChannel;
        const message = interaction.options.getString('message')!;
        await channel.send(message);
        await interaction.editReply({content: 'Message sent',allowedMentions:{parse:[]}});
    }
}