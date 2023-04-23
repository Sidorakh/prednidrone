import * as discord from 'discord.js';
import {ModalSubmitInteraction} from '../interaction-typedefs';
export const command: ModalSubmitInteraction = {
    id: 'modal',
    async handler(interaction) {
        await interaction.deferReply({ephemeral:true});
    }
}