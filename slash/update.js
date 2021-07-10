const discord = require('discord.js');
const {default: firebase} = require('firebase');
const setup = require('../command-setup');

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
    if (interaction.member.user.id != '141365209435471872') {
        const member = await interaction.guild.members.fetch(interaction.member.user.id);
        if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.editReply({ephemeral:true,content: 'You\'re not allowed to do that!'});
    }
    await interaction.defer({ephemeral:true});
    console.log(interaction.options.get('command')?.value);
    if ( setup.hasOwnProperty(interaction.options.get('command')?.value)) {
        await setup[interaction.options.get('command')?.value](interaction.guild);
        await interaction.editReply({ephemeral:true,content:`Command \`${(interaction.options.get('command')?.value || '_ _')}\` was updated successfully`});
    } else {
        await interaction.editReply({ephermal:true,content:`Command \`${interaction.options.get('command')?.value}\` was not found`});
    }
}
