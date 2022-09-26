import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';

type PrescenceType = 'competing'|'custom'|'listening'|'playing'|'streaming'|'watching';

export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('prescence')
                                                .setDescription('Set the bots prescence data')
                                                .addStringOption(v=>v.setName('type').setDescription('Type of prescence').setRequired(true).setChoices({
                                                    name:'Competing',
                                                    value: 'competing'
                                                },{
                                                    name: 'Listening',
                                                    value: 'listening',
                                                },{
                                                    name: 'Playing',
                                                    value: 'playing',
                                                },{
                                                    name: 'Streaming',
                                                    value: 'streaming',
                                                },{
                                                    name: 'Watching',
                                                    value: 'watching',
                                                }))
                                                .addStringOption(v=>v.setName('activity').setDescription('The activity').setRequired(true)),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral:true});
        const type = interaction.options.getString('type')! as PrescenceType;
        const activity = interaction.options.getString('activity')!;
        let type_enum: discord.ActivityType.Playing | discord.ActivityType.Streaming | discord.ActivityType.Listening | discord.ActivityType.Watching | discord.ActivityType.Competing | undefined = discord.ActivityType.Playing;
        switch (type) {
            case 'competing':
                type_enum = discord.ActivityType.Competing;
            break;
            case 'listening':
                type_enum = discord.ActivityType.Listening;
            break;
            case 'playing':
                type_enum = discord.ActivityType.Playing;
            break;
            case 'streaming':
                type_enum = discord.ActivityType.Streaming;
            break;
            case 'watching':
                type_enum = discord.ActivityType.Watching;
            break;
            
        }
        interaction.client.user.setPresence({activities:[{name: activity, type: type_enum}]})

        await interaction.editReply({content: 'Prescence set'});
    }
}