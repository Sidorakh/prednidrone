import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import { Option } from '../../db';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('set-option')
                                                .setDescription('Set an option in the bots config')
                                                .addStringOption(v=>v.setName('name').setDescription('Name of the option to set'))
                                                .addStringOption(v=>v.setName('value').setDescription('Value to set the option to')),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        const name = interaction.options.getString('name',true);
        const value = interaction.options.getString('value',true);
        await Option.upsert({id:name,value})
        await interaction.editReply(`Option \`${name}\` was set to \`${value}\``);
    }
}