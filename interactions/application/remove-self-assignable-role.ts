import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import { AssignableRole } from '../../db';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('remove-self-assignable-role')
                                                .setDescription('Remove a self-assignable role')
                                                .addRoleOption(v=>v.setName('role').setDescription('Role to remove').setRequired(true)),

    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        const role = interaction.options.getRole('role',true);
        const entry = await AssignableRole.findByPk(role.id);
        if (entry == null) {
            await interaction.editReply(`<@&${role.id}> is not currently a self-assignable role`);
            return;
        }
        const data = entry.get();
        await entry.destroy();
        await interaction.editReply({content: `<@&${role.id}> has been removed from the self-assignable \`${data.type}\` roles`});
    }
}