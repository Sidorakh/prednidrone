const discord = require('discord.js');
const {default: firebase} = require('firebase');
const fs = require('fs-extra');

module.exports.description = {
    name: 'update',
    description: 'Force an update for a given command',
    usage: '/update [command]',
    parameters: [
        {
            name: 'command',
            description: 'Command to force update',
        }
    ]
}


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
    if (interaction.member.user.id != '141365209435471872') {
        const member = await interaction.guild.members.fetch(interaction.member.user.id);
        if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.editReply({ephemeral:true,content: 'You\'re not allowed to do that!'});
    }
    await interaction.defer({ephemeral:true});
    if (fs.existsSync(`./slash/${interaction.options.get('command')?.value}.js`)) {
        if (interaction.options.get('command')?.value == 'update') {
            module.exports.setup(interaction.guild);
        } else {
            await require(`./${interaction.options.get('command')?.value}.js`).setup(interaction.guild);
        }
        await interaction.editReply({ephemeral:true,content:`Command \`${(interaction.options.get('command')?.value || '')}\` was updated successfully`});
    } else {
        await interaction.editReply({ephermal:true,content:`Command \`${interaction.options.get('command')?.value}\` was not found`});
    }
}

module.exports.setup = async function (/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name:'update',
        description: '(Admin only) Force-reregister/update of a slash command',
        options: [
            {
                name: 'command',
                description: 'Slash command to update',
                type: 'STRING',
                required: true,
            }
        ]
    });
};
