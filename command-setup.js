const discord = require('discord.js');
const {default: firebase} = require('firebase');


async function setup_role(/** @type {discord.Guild} */ guild) {
    const choices = [];
    const roles = (await firebase.firestore().collection(process.env.COLLECTION).doc('roles').get()).data();
    for (const role_id of Object.keys(roles)) {
        const role = guild.roles.cache.get(role_id)
        if (role != undefined) {
            choices.push({
                name: role.name,
                value: role.id
            });
        }
    }


    const command = await guild.commands.create({
        name: 'role',
        description: 'Assigns a given role',
        options: [
            {
                name: 'add',
                description: 'Add a role',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Role to add',
                        type: 'STRING',
                        required: true,
                        choices,
                    },
                ]
            },
            {
                name: 'remove',
                description: 'Remove a role',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Role to remove',
                        type: 'STRING',
                        required: true,
                        choices,
                    },
                ]
            },
            {
                name: 'list',
                description: 'List all self-assignable roles',
                type: 'SUB_COMMAND'
            },
            {
                name: 'register',
                description: '(Admin only) Register a self-assignable role',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Role to register',
                        type: 'ROLE',
                        required: true
                    },
                ]
            },
            {
                name: 'deregister',
                description: '(Admin only) De-registers a self-assignable role',
                type: 'SUB_COMMAND',
                options: [
                    {
                        name: 'role',
                        description: 'Role to deregister',
                        type: 'ROLE',
                        required: true
                    },
                ]
            },
        ]
    });

}

async function setup_lifetime(/** @type {discord.Guild} */ guild) {
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
};

async function setup_say(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name:'say',
        description: 'Sends a message from the bot',
        options: [
            {
                name: 'message',
                description: 'The message to send',
                type: 'STRING',
                required: true,
            },
            {
                name: 'channel',
                description: 'The channel to send the message in',
                type: 'CHANNEL',
                required: false,
            }
        ]
    });
};

async function setup_badrheumy(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({
        name: 'badrheumy',
        description: 'Complains about a bad rheumatologist',
    });
};




//rss-test__busy__busy__busy



async function setup_crisis(/** @type {discord.Guild} */ guild) {
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
    })
};

async function setup_setcommands(/** @type {discord.Guild} */ guild) {
    const command = guild.commands.create({
        name: 'setcommands',
        description: '(Admin only) Sets up or refreshes slash commands',
    });
};



async function setup_update(/** @type {discord.Guild} */ guild) {
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

async function setup_pronoun(/** @type {discord.Guild} */ guild) {
    const choices = [];
    const roles = (await firebase.firestore().collection(process.env.COLLECTION).doc('pronouns').get()).data();
    for (const role_id of Object.keys(roles)) {
        const role = guild.roles.cache.get(role_id)
        if (role != undefined) {
            choices.push({
                name: role.name,
                value: role.id
            });
        }
    }
    const command = await guild.commands.create({
        name: 'pronoun',
        description: 'Manages pronoun roles',
        options: [
            {
                name: 'add',
                description: 'Add a pronoun role',
                type:'SUB_COMMAND',
                options: [
                    {
                        name: 'pronoun',
                        description: 'Pronoun role to add',
                        type:'STRING',
                        required: true,
                        choices,
                    }
                ]
            },
            {
                name: 'remove',
                description: 'Remove a pronoun role',
                type:'SUB_COMMAND',
                options: [
                    {
                        name: 'pronoun',
                        description: 'Pronoun role to remove',
                        type:'STRING',
                        required: true,
                        choices,
                    }
                ]
            },
            {
                name: 'list',
                description: 'List available pronoun roles',
                type:'SUB_COMMAND',
            },
            {
                name: 'register',
                description: '(Admin only) Register a pronoun role',
                type:'SUB_COMMAND',
                options: [
                    {
                        name: 'pronoun',
                        description: 'Pronoun role to register',
                        type:'ROLE',
                        required: true,
                    }
                ]
            },
            {
                name: 'deregister',
                description: '(Admin only) Deregister a pronoun role',
                type:'SUB_COMMAND',
                options: [
                    {
                        name: 'pronoun',
                        description: 'Pronoun role to deregister',
                        type:'ROLE',
                        required: true,
                    }
                ]
            }
        ]
    })
};

async function setup_fancify(/** @type {discord.Guild} */ guild) {
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
};

async function setup_template(/** @type {discord.Guild} */ guild) {
    const command = await guild.commands.create({

    })
};


async function setup(/** @type {discord.Guild} */ guild){
    //await setup_register(guild);
    await setup_role(guild);
    await setup_lifetime(guild);
    await setup_say(guild);
    await setup_badrheumy(guild);
    await setup_setcommands(guild);
    await setup_crisis(guild);
    await setup_update(guild);
    await setup_pronoun(guild);
    await setup_fancify(guild);
}

module.exports = {
    setup,
    role:setup_role,
    lifetime:setup_lifetime,
    say:setup_say,
    badrheumy:setup_badrheumy,
    setcommands:setup_setcommands,
    crisis:setup_crisis,
    update:setup_update,
    pronoun:setup_pronoun,
    fancify:setup_fancify,
}
