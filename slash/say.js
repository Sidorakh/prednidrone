const discord = require('discord.js');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'say',
    description: 'Sends a message from the bot',
    usage: '/say [message] [channel]',
    parameters: [
        {
            name: 'message',
            description: 'Message to send',
        },
        {
            name: 'channel',
            description: '(Optional) The channel to send the message in',
        },
    ]
};

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const message = interaction.options.get('message')?.value;
    /** @type {discord.TextChannel} */
    const channel = interaction.options.get('channel')?.channel || interaction.channel;
    await interaction.reply({content:'Message sent',ephemeral: true});
    await channel.send({content: message,allowedMentions:{parse:[]}});
}

module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name:'say',
        description: 'Sends a message from the bot',
        options: [
            {
                name: 'message',
                description: 'The message to send',
                type: 'STRING',
                required: true,
            },
            {
                name: 'channel',
                description: '(Optional) The channel to send the message in',
                type: 'CHANNEL',
                required: false,
            }
        ]
    });
    return command;
};