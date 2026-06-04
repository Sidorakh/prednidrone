import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import { AssignableRole } from '../../db';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('add-self-assignable-role')
                                                .setDescription('Add a self-assignable role')
                                                .addStringOption(v=>v.setName('type').setDescription('Type of self-assignable role').setChoices([{name: 'Arthritis',value: 'arthritis'},{name: 'Pronoun',value: 'pronoun'}]).setRequired(true))
                                                .addRoleOption(v=>v.setName('role').setDescription('Role to add').setRequired(true)),

    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        const role = interaction.options.getRole('role',true);
        const type = interaction.options.getString('type',true);
        if (type != 'arthritis' && type != 'pronoun') {
            await interaction.editReply({content: `\`${type}\` is not a valid type of self-assignable role`});
            return;
        }
        await AssignableRole.upsert({id: role.id, type: type});
        await interaction.editReply({content: `<@&${role.id}> has been added to the self-assignable \`${type}\` roles`});
    }
}