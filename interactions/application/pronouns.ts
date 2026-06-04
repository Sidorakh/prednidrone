import * as discord from 'discord.js';
import {GUILD_ID} from '../../env';
import firebase from '../../firebase';
import { AssignableRole } from '../../db';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  
                        .setName('pronouns')
                        .setDescription('Assign pronoun roles')
                        .addSubcommand(
                            v=>v.setName('add')
                                .setDescription('Add a pronoun')
                                .addStringOption(v=>v.setName('pronoun').setDescription('Pronoun to add').setAutocomplete(true).setRequired(true))
                        )
                        .addSubcommand(
                            v=>v.setName('remove')
                                .setDescription('Remove a pronoun')
                                .addStringOption(v=>v.setName('pronoun').setDescription('Pronoun to remove').setAutocomplete(true).setRequired(true))
                        )
                        .addSubcommand(
                            v=>v.setName('list')
                                .setDescription('List available pronouns')
                                .addBooleanOption(v=>v.setName('show').setDescription('Make this message viewable by everyone? (Default: false)'))
                        ),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        if (interaction.options.getBoolean('show') == true) {
            await interaction.deferReply({});
        } else {
            await interaction.deferReply({flags:[discord.MessageFlags.Ephemeral]});
        }
        if (!interaction.guild) {
            interaction.editReply('You must run this command in the server');
            return;
        }
        const subcommand = interaction.options.getSubcommand(true);
        if (subcommand == 'list') {
            const pronouns = await AssignableRole.findAll({where: {type: 'pronoun'}});
            interaction.editReply({content: `Available pronoun roles: \n${pronouns.map(v=>`- <@&${v.get().id}>`).join('\n')}`});
            return;
        }
        const role_id = interaction.options.getString('pronoun',true);
        const role = await interaction.guild.roles.fetch(role_id);
        if (role == null) {
            interaction.editReply({content: `<@&${role_id}> is not an available option, use /pronoun list to view available roles`});
            return;
        }
        if (subcommand == 'add') {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            await member.roles.add(role_id);
            interaction.editReply({content: `Added pronoun <@&${role_id}> pronoun role`,allowedMentions:{parse:[]}});
        }
        if (subcommand == 'remove') {
            const member = await interaction.guild.members.fetch(interaction.user.id);
            await member.roles.remove(role_id);
            interaction.editReply({content: `Removed <@&${role_id}> pronoun role`,allowedMentions:{parse:[]}});
        }
    },
    async autocomplete(interaction: discord.AutocompleteInteraction<discord.CacheType>) {
        if (!interaction.guild) {
            interaction.respond([{name: 'Run this command in the server',value:'123'}]);
            return;
        }
        const role_ids = await AssignableRole.findAll({where:{type: 'pronoun'}});
        const roles: discord.Role[] = [];

        for (const r of role_ids) {
            const role = await interaction.guild.roles.fetch(r.get().id);
            if (role) {
                roles.push(role);
            }
        }

        const option = interaction.options.getFocused(true);
        const guild = interaction.guild;
        const member = await guild!.members.fetch(interaction.user.id);
        if (interaction.options.getSubcommand() == 'add') {
            const options = roles.filter(v=>!member.roles.cache.has(v.id));
            interaction.respond(options.map(v=>({name:v.name,value:v.id})).filter(v=>option.value.trim()=='' || v.name.toLowerCase().includes(option.value.toLowerCase())));
            return;
        } else {
            const options = roles.filter(v=>member.roles.cache.has(v.id));
            interaction.respond(options.map(v=>({name:v.name,value:v.id})).filter(v=>option.value.trim()=='' || v.name.toLowerCase().includes(option.value.toLowerCase())));
            return; 
        }
    }
}