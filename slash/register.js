const discord = require('discord.js');
const {default: firebase} = require('firebase');


module.exports.command = async (/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client)=>{
    //console.log(interaction.options);
    const {admin_role} = (await firebase.firestore().collection(process.env.COLLECTION).doc('settings').get()).data();
    
    const cmd = interaction.options.firstKey();
    switch (cmd) {
        case 'add':
            await add(interaction,client);
        break;
        case 'remove':
            await remove(interaction,client);
        break;
        case 'list':
            await list(interaction,client);
        break;
    }

}

async function add(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephermal:true});
    const role = interaction.options.get('add').options.get('role').role;
    await firebase.firestore().collection(process.env.COLLECTION).doc('roles').update({
        [role.id]: true,
    });
    interaction.editReply({content: `Role ${role} added successfully`});
}

async function remove(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    await interaction.defer({ephermal:true});
    const role = interaction.options.get('remove').options.get('role').role;
    await firebase.firestore().collection(process.env.COLLECTION).doc('roles').update({
        [role.id]: firebase.firestore.FieldValue.delete(),
    });
    interaction.editReply({content: `Role ${role} removed successfully`});
}

async function list(/** @type {discord.CommandInteraction} */ interaction, /** @type {discord.Client} */ client) {
    const roles = (await firebase.firestore().collection(process.env.COLLECTION).doc('roles').get()).data();
    const role_list = [];
    for (const role_id of Object.keys(roles)) {
        const role = interaction.guild.roles.cache.get(role_id)
        if (role != undefined) {
            role_list.push(role);
        }
    }
    interaction.editReply({ephemeral:true,content: 'Available roles: ' + role_list.join(', ')});
};