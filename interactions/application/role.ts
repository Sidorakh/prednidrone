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
                        )
                        .addSubcommand(
                            v=>v.setName('list')
                                .setDescription('List available roles')
                        ),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const subcommand = interaction.options.getSubcommand();
        const role_id = interaction.options.getString('role')!;
        if (subcommand == 'add') {
            try {
                await interaction.guild?.roles.fetch(role_id);
            } catch(e) {
                interaction.editReply(`${role_id} is not an available role, use \`/role list\` to view available roles`);
            }
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.add(role_id);
            interaction.editReply({content: `Added role <@&${role_id}>`,allowedMentions:{parse:[]}});
        }
        if (subcommand == 'remove') {
            try {
                await interaction.guild?.roles.fetch(role_id);
            } catch(e) {
                interaction.editReply(`${role_id} is not an available role, use \`/role list\` to view available roles`);
            }
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.remove(role_id)
            await interaction.editReply({content: `Removed role <@&${role_id}>`,allowedMentions:{parse:[]}});
        }
        if (subcommand == 'list') {
            const roles = await get_roles();
            await interaction.editReply({content:'Available roles: \n' + roles.map(v=>` • <@&${v.id}>`).join('\n'),allowedMentions:{parse:[]}});
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