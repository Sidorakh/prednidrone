import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
import {get_interactions} from '../';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()  .setName('help')
                                                .setDescription('List all commands or get help for a specific command')
                                                .addStringOption(v=>v.setName('command').setDescription('What to look up').setRequired(true).setAutocomplete(true)),
    async handler(interaction: discord.ChatInputCommandInteraction<discord.CacheType>) {
        await interaction.deferReply({ephemeral: true});
        const command = interaction.options.getString('command')!;
        if (command == 'list-commands') {
            const commands = list_commands().map(v=>` • **/${v.name}** : ${v.description}`).join('\n\n');
            const embed = new discord.EmbedBuilder().setTitle('List of commands').setColor('#32bca0').setDescription(commands);
            await interaction.editReply({embeds:[embed]});
            return;
        } else {
            const cmd = get_command(command);
            if (cmd) {
                const embed = new discord.EmbedBuilder().setTitle('/' + cmd.name).setColor('#32bca0').setDescription(cmd.description);
                if ((cmd.options || []).length > 0) {
                    for (const option of cmd.options) {
                        embed.addFields({
                            name: option.name,
                            value: `(${option_type_to_name(option.type)}) ${option.description}`,
                        });
                    }
                }
                interaction.editReply({embeds:[embed]});
            } else {
                interaction.editReply({content: `Command ${command} not found`});
                return;
            }
        }
    },
    async autocomplete(interaction){
        const options = [{name: 'List Commands',value: 'list-commands'},...list_commands().map(v=>({name:v.name,value:v.name}))];
        const option = interaction.options.getFocused(true);
        await interaction.respond(options.filter(v=>option.value.trim()=='' || v.name.toLowerCase().includes(option.value.toLowerCase())));
    }
}

function option_type_to_name(type: OptionValueType) {
    switch (type) {
        case OptionValueType.Subcommand: return 'subcommand';
        case OptionValueType.SubcommandGroup: return 'subcommand-group';
        case OptionValueType.String: return 'string';
        case OptionValueType.Integer: return 'integer';
        case OptionValueType.Boolean: return 'boolean';
        case OptionValueType.User: return 'user';
        case OptionValueType.Channel: return 'channel';
        case OptionValueType.Role: return 'role';
        case OptionValueType.Mentionable: return 'mentionable';
        case OptionValueType.Number: return 'number';
        case OptionValueType.Attachment: return 'attachment';
    }
}

enum OptionValueType {
    Subcommand = 1,
    SubcommandGroup = 2,
    String = 3,
    Integer = 4,
    Boolean = 5,
    User = 6,
    Channel = 7,
    Role = 8,
    Mentionable = 9,
    Number = 10,
    Attachment = 11,

}

type CommandOptionChoice = {
    name: string;
    name_localizations: {[key: string]: string};
    value: string | number;
}

type CommandOption = {
    type: OptionValueType;
    name: string;
    description: string;
    autocomplete?: boolean;
    options?: CommandOption[];
    choices?: CommandOptionChoice[];
}

type CommandBody = {
    name: string;
    description: string;
    options: CommandOption[];
}

function get_command(name: string) {
    const cmd = get_interactions().application.find(v=>v.command.name == name)
    if (cmd) {
        return cmd.command.toJSON() as unknown as CommandBody;
    }
    return null;
}

function list_commands() {
    return get_interactions().application.map(v=>v.command.toJSON()) as unknown as CommandBody[]
}