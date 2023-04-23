import * as discord from 'discord.js';
import {setup_reaction_roles} from '../../services/reaction-roles'
import {ModalSubmitInteraction} from '../interaction-typedefs';
export const command: ModalSubmitInteraction = {
    id: 'reaction-role-modal',
    async handler(interaction) {
        interaction.reply({ephemeral:true,content:"done!"})
        const data_id = interaction.customId.replace(`${this.id}:`,'');
        const message = interaction.fields.getTextInputValue('message');
        const json = interaction.fields.getTextInputValue('json');
        await setup_reaction_roles(json,message,data_id);
    }
}