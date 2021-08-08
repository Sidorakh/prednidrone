const discord = require('discord.js');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'badrheumy',
    description: 'Complains about a bad rheumatologist',
    usage: '/badrheumy',
    parameters: []
};

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    await interaction.reply({content:'How do you even fuck that up!',ephemeral: false});
}

module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name: 'badrheumy',
        description: 'Complains about a bad rheumatologist',
    });
    return command;
};
