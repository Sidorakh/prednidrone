import * as discord from 'discord.js';
import {GUILD_ID} from '../../env';
import firebase from '../../firebase';
import {get_pronouns} from '../../bot-config';
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
                        ),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const subcommand = interaction.options.getSubcommand();
        const pronoun = interaction.options.getString('pronoun')!;
        if (subcommand == 'add') {
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.add(pronoun);
            interaction.editReply({content: `Added pronoun <@&${pronoun}>`});
        } else {
            const member = await interaction.guild!.members.fetch(interaction.user.id);
            await member.roles.remove(pronoun)
            interaction.editReply({content: `Removed pronoun <@&${pronoun}>`});
        }
    },
    async autocomplete(interaction: discord.AutocompleteInteraction<discord.CacheType>) {
        const roles = await get_pronouns();
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