const discord = require('discord.js');
const {default: firebase} = require('firebase');

module.exports.description = {
    name: 'pronoun',
    description: 'Add, remove, and list pronoun roles',
    usage: '/pronoun [add|remove|list] [role]',
    parameters: [
        {
            name:'command',
            description:'Whether to add a pronoun role, remove a pronoun role, or list all pronoun roles',
        },
        {
            name: 'role',
            description: '(Optional) Role',
        }
    ]
};

module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
    const cmd = interaction.options.firstKey();
    switch (cmd) {
        case 'add':
            await add(interaction,client);
        break;
        case 'remove':
            await remove(interaction,client);
        break;
        case 'register':
            // always allow Sidorakh#8297 in case of fuckup
            if (interaction.member.user.id != '141365209435471872') {
                const member = await interaction.guild.members.fetch(interaction.member.user.id);
                if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.reply({ephemeral:true,content: 'You\'re not allowed to do that!'});
            }
            await register(interaction,client);
        break;
        case 'deregister':
            // always allow Sidorakh#8297 in case of fuckup
            if (interaction.member.user.id != '141365209435471872') {
                const member = await interaction.guild.members.fetch(interaction.member.user.id);
                if (!member.roles.cache.find(role=>role.id==admin_role)) return interaction.reply({ephemeral:true,content: 'You\'re not allowed to do that!'});
            }
            await deregister(interaction,client);
        break;
        case 'list':
            await list(interaction,client);
        break;
    }

}

async function add(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephemeral:true});
    const role_id = interaction.options.get('add').options.get('pronoun').value;
    const role = interaction.guild.roles.cache.get(role_id);

    await interaction.member.roles.add(role)
    await interaction.editReply({ephemeral:true,content:`Pronoun role ${role} added successfully`});
}

async function remove(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephemeral:true});
    const role_id = interaction.options.get('remove').options.get('pronoun').value;
    const role = interaction.guild.roles.cache.get(role_id);

    await interaction.member.roles.remove(role);
    await interaction.editReply({ephemeral:true,content:`Pronoun role ${role} removed successfully`});
}

async function list(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephemeral:true});
    const roles = (await firebase.firestore().collection(process.env.COLLECTION).doc('pronouns').get()).data();
    const role_list = [];
    for (const role_id of Object.keys(roles)) {
        const role = interaction.guild.roles.cache.get(role_id)
        if (role != undefined) {
            role_list.push(role);
        }
    }
    interaction.editReply({content: 'Available pronouns: \n' + role_list.sort((a,b)=>a.id-b.id).map((v,i)=>`${i+1}. ${v}`).join('\n') + '\nAssign a role by using the `/role add` command'});
};

async function register(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephemeral:true});
    const role = interaction.options.get('register').options.get('pronoun').role;
    await firebase.firestore().collection(process.env.COLLECTION).doc('pronouns').update({
        [role.id]: true,
    });
    interaction.editReply({content: `Pronoun role ${role} registered successfully`});
}

async function deregister(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephemeral:true});
    const role = interaction.options.get('deregister').options.get('pronoun').role;
    await firebase.firestore().collection(process.env.COLLECTION).doc('pronouns').update({
        [role.id]: firebase.firestore.FieldValue.delete(),
    });
    interaction.editReply({content: `Pronoun role ${role} deregistered successfully`});
}

module.exports.setup = async function(/** @type {discord.Guild} */ guild) {
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
    });
    return command;
};