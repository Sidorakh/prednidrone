const discord = require('discord.js');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'crisis',
    description: 'Report a crisis situation to the administration team',
    usage: '/crisis [message]',
    parameters: [
        {
            name: 'message',
            description: 'Describe the incident',
        }
    ]
};

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const message = interaction.options.get('message')?.value;
    await interaction.reply({content:'Message sent',ephemeral: true});
    /** @type {discord.TextChannel} */
    const channel = interaction.guild.channels.cache.find(ch=>ch.name=='crisis');
    await channel.send({content: `Report from ${interaction.member} in ${interaction.channel}, @here - ` + message});
}


module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name:'crisis',
        description: 'Report a crisis siutation to the administation team',
        options: [
            {
                name:'message',
                description: 'Describe the incident',
                type:'STRING',
                required:true
            }
        ]
    });
    return command;
};