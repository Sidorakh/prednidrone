import * as discord from 'discord.js';
import {GUILD_ID} from '../../env';
import firebase from '../../firebase';
import {get_roles} from '../../bot-config';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  
                        .setName('role')
                        .setDescription('Assign some arthritis roles')
                        .addSubcommand(
                            v=>v.setName('add')
                                .setDescription('Add a role')
                                .addStringOption(v=>v.setName('role').setDescription('Role to add').setAutocomplete(true).setRequired(true))
                        )
                        .addSubcommand(
                            v=>v.setName('remove')
                                .setDescription('Remove a role')
                                .addStringOption(v=>v.setName('role').setDescription('Role to remove').setAutocomplete(true).setRequired(true))
                        ),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const subcommand = interaction.options.getSubcommand();
        const role = interaction.options.getString('role')!;
        if (subcommand == 'add') {
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.add(role);
            interaction.editReply({content: `Added role <@&${role}>`});
        } else {
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.remove(role)
            interaction.editReply({content: `Removed role <@&${role}>`});
        }
    },
    async autocomplete(interaction: discord.AutocompleteInteraction<discord.CacheType>) {
        const roles = await get_roles();
        const option = interaction.options.getFocused(true);
        const guild = interaction.guild;
        const member = await guild!.members.fetch(interaction.user.id);
        if (interaction.options.getSubcommand() == 'add') {
            const options = roles.filter(v=>!member.roles.cache.has(v.id));
            interaction.respond(options.map(v=>({name:v.name,value:v.id})).filter(v=>option.value.trim()=='' || v.name.toLowerCase().includes(option.value.toLowerCase())));
        } else {
            const options = roles.filter(v=>member.roles.cache.has(v.id));
            return interaction.respond(options.map(v=>({name:v.name,value:v.id})).filter(v=>option.value.trim()=='' || v.name.toLowerCase().includes(option.value.toLowerCase())));
        }
    }
}