const discord = require('discord.js');
const {default: firebase} = require('firebase');
const {default: axios} = require('axios');

module.exports.description = {
    name: 'yt',
    description: 'Searches YouTube for a given video and posts it',
    usage: '/yt [query]',
    parameters: [
        {
            name: 'query',
            description: 'Search query',
        },
    ]
};

const api_url = 'https://script.google.com/macros/s/AKfycbwmHpfHg00jbeFijrhYW-1JcjtCtIy2JbW3icqOTwbiCZCowbekvNRyEuxclGSyyHA87g/exec?query=';

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    interaction.defer({ephemeral:false});
    const query = interaction.options.get('query')?.value || '';
    const result = await axios.get(api_url + encodeURIComponent(query));

    if (result.data.items.length > 0) {
        interaction.editReply({
            content:`https://youtube.com/watch?v=${result.data.items[0].id.videoId}`,
            allowedMentions:{parse:[]},
        });
    } else {
        interaction.editReply({
            content: `No videos found for the term \`query\``,
            allowedMentions:{parse:[]},
        });
    }
}

module.exports.setup = async function (/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name: 'yt',
        description: 'Searches Youtube for a given video and posts it',
        options: [
            {
                name: 'query',
                description: 'Search query',
                type: 'STRING',
                required: true,
            }
        ]
    });
    return command;
};