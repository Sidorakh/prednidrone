import * as discord from 'discord.js';
import {MessageContextMenuInteraction} from '../interaction-typedefs';
export const command: MessageContextMenuInteraction = {
    description: 'MessageContextMenuCommand',
    command: new discord.ContextMenuCommandBuilder().setType(discord.ApplicationCommandType.Message)
                                                    .setName('Message'),
    async handler(interaction) {
        await interaction.deferReply({ephemeral:true});
        
        await interaction.editReply({content: 'Message sent'});
    }
}