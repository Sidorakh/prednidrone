const discord = require('discord.js');
const lut = require('./fancify.json');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'fancify',
    description: 'Echo back text in a different text style',
    usage: '/fancify',
    parameters: [
        {
            name: 'style',
            description: 'Style of text to write back'
        },
        {
            name: 'message',
            description: 'Text to make fancy',
        }
    ]
};

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const message = interaction.options.get('message')?.value;
    const style = interaction.options.get('style')?.value;

    /** @type {discord.TextChannel} */
    if (lut[style] == undefined) {
        return await interaction.reply({content:'Type not found',ephemeral: true});
    } else {
        await interaction.reply({content:'Message sent',ephemeral: true});
    }
    let fancy_message = '';
    const new_alphabet = lut[style];
    const old_alphabet = lut.alphabet;

    for (let i=0;i<message.length;i++) {
        const c = message[i];
        if (old_alphabet[0].indexOf(c) != -1) {
            fancy_message += new_alphabet[0][old_alphabet[0].indexOf(c)];
        } else if (old_alphabet[1].indexOf(c) != -1) {
            fancy_message += new_alphabet[1][old_alphabet[1].indexOf(c)];
        } else {
            fancy_message += c;
        }
    }
    if (style == 'australian') {
        fancy_message = fancy_message.split('').reverse().join('');
    }

    await interaction.channel.send({content: fancy_message,allowedMentions:{parse:[]}})
}

module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name: 'fancify',
        description: 'Echo back text in a different text style',
        options: [
            {
                name: 'style',
                description: 'Style of text to write back',
                type: 'STRING',
                required: true,
                choices: [
                    {
                        name: 'Ye Olde',
                        value: 'yeolde',
                    },
                    {
                        name: 'Cursive',
                        value: 'cursive',
                    },
                    {
                        name: 'Stroke',
                        value: 'stroke',
                    },
                    {
                        name: 'Australian',
                        value: 'australian',
                    },
                ],
            },
            {
                name: 'message',
                description: 'Text to make fancy',
                type: 'STRING',
                required: true,
            }
        ]
    });
    return command;
};