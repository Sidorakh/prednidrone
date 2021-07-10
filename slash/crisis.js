const discord = require('discord.js');
const {default: firebase} = require('firebase');


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const message = interaction.options.get('message')?.value;
    await interaction.reply({content:'Message sent',ephemeral: true});
    /** @type {discord.TextChannel} */
    const channel = interaction.guild.channels.cache.find(ch=>ch.name=='crisis');
    await channel.send({content: `Report from ${interaction.member} in ${interaction.channel}, @here - ` + message});
}
