import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import { Option } from '../../db';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('get-option')
                                                .setDescription('Get an option in the bots config')
                                                .addStringOption(v=>v.setName('name').setDescription('Name of the option to get')),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        const name = interaction.options.getString('name',true);
        const option = await Option.findByPk(name);
        if (option) {
            await interaction.editReply(`${name}: \`${option.get().value}\``)
        } else {
            await interaction.editReply(`${name}: not set`)
        }
        
        
    }
}