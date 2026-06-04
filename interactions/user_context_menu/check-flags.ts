import * as discord from 'discord.js';
import {UserContextMenuInteraction} from '../interaction-typedefs';

interface UserData {
    avatar: null,
    banner: null,
    communication_disabled_until: null,
    flags: number,
    joined_at: string,
    nick: null,
    pending: false,
    premium_since: null,
    roles: string[],
    unusual_dm_activity_until: string|null,
    collectibles: null,
    display_name_styles: null,
    user: {
        id: string,
        username: string,
        avatar: string | null,
        discriminator: string,
        public_flags: 0,
        flags: number,
        banner: null,
        accent_color: null,
        global_name: string,
        avatar_decoration_data: null,
        collectibles: null,
        display_name_styles: null,
        banner_color: null,
        clan: null,
        primary_guild: null
    },
    mute: false,
    deaf: false
}

// Flags from https://flags.lewisakura.moe/
export const command: UserContextMenuInteraction = {
    description: 'Check user flags',
    command: new discord.ContextMenuCommandBuilder().setType(discord.ApplicationCommandType.User)
                                                    .setName('Check flags'),
    async handler(interaction) {
        await interaction.deferReply({flags: discord.MessageFlags.Ephemeral});
        if (!interaction.inGuild()) {
            await interaction.editReply({content: 'Must be run in a guild'});
            return;
        }
        const data = await interaction.client.rest.get(discord.Routes.guildMember(interaction.guildId,interaction.targetId)) as UserData;
        const account_flagged_as_suspected_spammer = (data.user.flags & 1048576) != 0;
        let timeout_until = null;
        let flag_applied = null;
        if (data.communication_disabled_until) {
            timeout_until = Math.floor(new Date(data.communication_disabled_until).valueOf() / 1000);
        }
        if (data.unusual_dm_activity_until) {
            flag_applied = Math.floor(new Date(data.unusual_dm_activity_until).valueOf() / 1000);
        }
        let content = '';
        content += 'Current timeout: ';
        if (timeout_until != null && timeout_until > (Date.now()/1000)) {
            content += `until <t:${timeout_until}:f>`;
        } else {
            content += 'None';
        }
        content += '\n';
        content += 'System flags: \n';
        if (account_flagged_as_suspected_spammer) {
            content += '- Suspected spammer\n'
        } else if (flag_applied) {
            content += '- Excessive DM\'s to non-friends in last 24 hours\n';
        }
        if (flag_applied) {
            content += `Applied at <t:${flag_applied}:f>`
        }
        if (!account_flagged_as_suspected_spammer && !flag_applied) {
            content += 'No system flags applied';
        }
        content += `\n`;
        const embed = new discord.EmbedBuilder().setTitle(`Details about ${interaction.targetUser.displayName}`).setDescription(content);
        await interaction.editReply({content: '',embeds: [embed]});
    }
}