import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    description: 'Makes the bot say words',
    parameters: [
        {
            name: 'message',
            description: 'Message to send',
            required: true,
        },
        {
            name: 'channel',
            description: 'Channel to send message in',
            required: false,
        }
    ],
    command: new discord.SlashCommandBuilder()  .setName('say')
                                                .addStringOption(v=>v.setName('message').setDescription('Message to send').setRequired(true))
                                                .addChannelOption(v=>v.setName('channel').setDescription('Channel to send message in')),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const channel = (interaction.options.getChannel('channel') || interaction.channel) as discord.TextBasedChannel;
        const message = interaction.options.getString('message')!;
        await channel.send(message);
        await interaction.editReply({content: 'Message sent'});
    }
}