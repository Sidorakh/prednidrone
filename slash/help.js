const discord = require('discord.js');
const fs = require('fs-extra');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'help',
    description: 'Display help for a given command',
    usage: '/help [command]',
    parameters: [
        {
            name: 'command',
            description: 'Command to view help for',
        }
    ]
}

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    await interaction.defer({ephemeral:true});
    if (fs.existsSync(`./slash/${interaction.options.get('command')?.value}.js`)) {
        let help = null;
        if (interaction.options.get('command')?.value == 'update') {
            help = module.exports.description;
        } else {
            help = require(`./${interaction.options.get('command')?.value}.js`).description;
        }
        const fields = [];
        if (help.parameters) {
            for (let i=0;i<help.parameters.length;i++) {
                fields[i] = {
                    name:help.parameters[i].name,
                    value:help.parameters[i].description
                };
            }
        }
        const embed = {
            author: {
                name: '/' + help.name,
            },
            description: help.description,
            fields,

        }
        await interaction.editReply({ephemeral:true,embeds: [embed]});
    } else {
        await interaction.editReply({content:`Command ${interaction.options.get('command')?.value} not found`});
    }
}

module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
    const files = await fs.readdir('./slash');
    files.splice(0, files.length,...files.filter(v=>v.endsWith('.js')));
    files.splice(0,files.length,...files.map(v=>v.replace('.js','')));
    files.splice(0,files.length,...files.map(v=>({name:v,value:v})));
    console.log(files);
    const command = await guild.commands.create({
        name: 'help',
        description: 'Get help for a command',
        options: [
            {
                name: 'command',
                description: 'Command to view help for',
                type: 'STRING',
                choices: files,
            }
        ]
    });
    return command;
};
