import * as discord from 'discord.js';
import {DatabaseHelper} from '../../database-helper';
export async function command(client: discord.Client, dbh:DatabaseHelper, msg: discord.Message, args: String[]) {
    if (msg.guild == undefined) {
        return `You can only use \`!lifetime\` in a server`;
    }
    if (args.length == 0) {
        return `${msg.member.displayName}, you have been a member of this Discord server since ${msg.member.joinedAt}`;
    } else {
        const member = await msg.guild.fetchMember(args[0].replace(/[<!@>]+/g,''));
        return `${member.displayName} has been a member of this server since ${member.joinedAt}`;
    }
}   