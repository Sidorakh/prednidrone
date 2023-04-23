import * as discord from 'discord.js';
import {start_reaction_roles} from './../../services/reaction-roles';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('reaction-roles')
                                                .setDescription('Set up reaction roles')
                                                .addChannelOption(opt=>opt
                                                    .setName('channel')
                                                    .setDescription('Channel to post in')
                                                    .addChannelTypes(discord.ChannelType.GuildText,discord.ChannelType.GuildAnnouncement)
                                                    .setRequired(true)),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        const id = start_reaction_roles(interaction.options.getChannel('channel')!.id);
        const modal = new discord.ModalBuilder()
                            .setCustomId(`reaction-role-modal:${id}`)
                            .setTitle('set up reaction roles')
                            .addComponents(
                                new discord.ActionRowBuilder<discord.ModalActionRowComponentBuilder>().addComponents(
                                    new discord.TextInputBuilder()
                                        .setCustomId('message')
                                        .setLabel('Message')
                                        .setStyle(discord.TextInputStyle.Short)
                                        .setRequired(true)
                                )
                            )
                            .addComponents(
                                new discord.ActionRowBuilder<discord.ModalActionRowComponentBuilder>().addComponents(
                                    new discord.TextInputBuilder()
                                        .setCustomId('json')
                                        .setLabel('JSON Data')
                                        .setStyle(discord.TextInputStyle.Paragraph)
                                        .setRequired(true)
                                )
                            )
                            
        //
        return interaction.showModal(modal);
    }
}