const discord = require('discord.js');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'lifetime',
    description: 'Gets the join date/time of a specified user',
    usage: '/lifetime [user]',
    parameters: [
        {
            name: 'user',
            description: '(Optional) The user to check',
        }
    ]
}

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const user = interaction.options.get('user')?.user;
    if (!user) {
        return interaction.reply(`${interaction.member.displayName}, you have been a member of this server since <t:${Math.floor(interaction.member.joinedTimestamp/1000)}:F>`);
    }
    const member = await interaction.guild.members.fetch(user);
    return interaction.reply(`${member.displayName} has been a member of this server since <t:${Math.floor(member.joinedTimestamp/1000)}:F>`);
}

module.exports.setup = async function (/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name:'lifetime',
        description: 'Gets the join date/time of a specified user',
        options: [
            {
                name: 'user',
                description: 'The user to check',
                type: 'USER',
                required: false,
            }
        ]
    });
    return command;
};