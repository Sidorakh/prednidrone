import * as discord from 'discord.js';

const client = new discord.Client({intents: [
    discord.IntentsBitField.Flags.Guilds,
    discord.IntentsBitField.Flags.GuildMessages,
    discord.IntentsBitField.Flags.GuildMessageReactions,
    discord.IntentsBitField.Flags.DirectMessageReactions,
    discord.IntentsBitField.Flags.GuildMembers,
    discord.IntentsBitField.Flags.GuildWebhooks,
    discord.IntentsBitField.Flags.MessageContent,
]});

export default client;