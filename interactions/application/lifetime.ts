import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('lifetime')
                                                .setDescription('Show when the specified member joined the server, or yourself if nobody is specified')
                                                .addUserOption(v=>v.setName('member').setDescription('Member to check')),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const user_id = (interaction.options.getUser('member') || interaction.user).id;
        const member = await interaction.guild!.members.fetch(user_id);

        if (member.joinedAt) {
            await interaction.editReply(`${member.displayName} has been a member of this server since ${discord.time(member.joinedAt)}`)
        } else {
            await interaction.editReply(`Could not work out when ${member.displayName} joined this server`);
        }
    }
}