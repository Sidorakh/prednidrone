const discord = require('discord.js');
const {default: firebase} = require('firebase');


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    await interaction.reply({content:'How do you even fuck that up!',ephemeral: false});
}
