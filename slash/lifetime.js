const discord = require('discord.js');
const {default: firebase} = require('firebase');


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const user = interaction.options.get('user')?.user;
    if (!user) {
        return interaction.reply(`${interaction.member.displayName}, you have been a member of this server since <t:${Math.floor(interaction.member.joinedTimestamp/1000)}:F>`);
    }
    const member = await interaction.guild.members.fetch(user);
    return interaction.reply(`${member.displayName} has been a member of this server since <t:${Math.floor(member.joinedTimestamp/1000)}:F>`);
    

}
