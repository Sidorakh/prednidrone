import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import {get_interactions} from '../';
export const command: ApplicationCommandInteraction = {
    description: 'Makes the bot say words',
    parameters: [],
    command: new discord.SlashCommandBuilder()  .setName('help')
                                                .setDescription('List all commands or get help for a specific command')
                                                .addStringOption(v=>v.setName('command').setRequired(true).setAutocomplete(true)),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral: true});
        await interaction.editReply({content: 'Message sent'});
    },
    async autocomplete(interaction){
        const options = [{name: 'List Commands',value: 'list-commands'},...Object.keys(get_interactions().application).map(v=>({name:v,value:v}))];
        await interaction.respond(options);
    }
}