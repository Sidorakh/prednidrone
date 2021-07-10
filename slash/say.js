const discord = require('discord.js');
const {default: firebase} = require('firebase');


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const message = interaction.options.get('message')?.value;
    /** @type {discord.TextChannel} */
    const channel = interaction.options.get('channel')?.channel || interaction.channel;
    await interaction.reply({content:'Message sent',ephemeral: true});
    await channel.send({content: message,allowedMentions:{parse:[]}});
}
