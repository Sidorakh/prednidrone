import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('lifetime')
                                                .setDescription('Show when the specified member joined the server, or yourself if nobody is specified')
                                                .addUserOption(v=>v.setName('member').setDescription('Member to check'))
                                                .addBooleanOption(v=>v.setName('show').setDescription('Make this message viewable by everyone? (Default: false)').setRequired(false)),

    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        if (interaction.options.getBoolean('show') == true) {
            await interaction.deferReply({});
        } else {
            await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        }
        const user_id = (interaction.options.getUser('member') || interaction.user).id;
        const member = await interaction.guild!.members.fetch(user_id);

        if (member.joinedAt) {
            await interaction.editReply({content:`<@${member.id}> has been a member of this server since ${discord.time(member.joinedAt)}`,allowedMentions:{parse:[]}});
        } else {
            await interaction.editReply({content:`Could not find out when <@${member.id}> joined this server`,allowedMentions:{parse:[]}});
            //editReply(`Could not work out when ${member.displayName} joined this server`);
        }
    }
}