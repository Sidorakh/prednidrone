require('dotenv').config();
const discord = require('discord.js')
const {default: axios} = require('axios');
const express = require('express');
const admin = require('firebase-admin');

admin.initializeApp({
    credential: admin.credential.cert(require('./admin')),
});

const firestore = admin.firestore();
let role_collection = 'prednidrone-roles';
const app = express();
app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.listen(process.env.PORT);

const client = new discord.Client();
client.login(process.env.TOKEN);

client.ws.on('INTERACTION_CREATE',async interaction=>{
    switch (interaction.data.name) {
        case 'role':
            await role_command(interaction)
        break;
        case 'say':
            await say_command(interaction);
        break;
        case 'lifetime':
            await lifetime_command(interaction);
        break;
    }
})

async function get_roles(for_command=false) {
    const role_list = (await firestore.collection(role_collection).get()).docs;
    const roles = [];
    if (for_command == false) {
        for (const doc of role_list) {
            const role = {id: doc.id,...doc.data()};
            roles.push(role);
        }
    } else {
        for (const doc of role_list) {
            const data = doc.data();
            if (data.assignable == false) continue;
            const role = {name: data.name, value: doc.id};
            roles.push(role);
        }
    }
    return roles;
}

async function role_command(interaction) {
    const guild = client.guilds.cache.first();
    const roles = await get_roles(true);
    
    const name = interaction.data.options[0].name;
    const member = await client.guilds.cache.first().members.fetch(interaction.member.user.id);
    if (name == "add") {
        const role = await guild.roles.fetch(interaction.data.options[0].options[0].value);
        const param = interaction.data.options[0].options[0];
        await member.roles.add(param.value);
        client.api.interactions(interaction.id,interaction.token).callback.post({
            data: {
                type:4,
                data:{
                    flags:64,
                    content: `Role ${role.name} added succesfully`,
                },
            }
        });
    } else if (name == "remove") {
        const role = await guild.roles.fetch(interaction.data.options[0].options[0].value);
        const param = interaction.data.options[0].options[0];
        await member.roles.remove(param.value);
        client.api.interactions(interaction.id,interaction.token).callback.post({
            data: {
                type:4,
                data:{
                    flags:64,
                    content: `Role ${role.name} removed succesfully`,
                },
            }
        });
    } else if (name == "clear") {
        client.api.interactions(interaction.id,interaction.token).callback.post({
            data: {
                type:4,
                data:{
                    flags:64,
                    content: `Roles cleared succesfully`,
                },
            }
        });
        for (const role of roles) {
            await member.roles.remove(role.value);
        }
    }
}

async function say_command(interaction) {
    const guild = client.guilds.cache.first();
    /** @type {discord.TextChannel} */
    const channel = guild.channels.cache.get(interaction.channel_id);
    client.api.interactions(interaction.id,interaction.token).callback.post({
        data: {
            type:4,
            data:{
                flags:64,
                content: `Prednidrone has spoken`,
            },
        }
    });
    channel.send(interaction.data.options[0].value);
}

async function lifetime_command(interaction) {
    const user = await client.guilds.cache.first().members.fetch(interaction.data.options[0].value)            //.resolve(interaction.data.options[0].value);
    client.api.interactions(interaction.id,interaction.token).callback.post({
        data: {
            type:4,
            data:{
                content: `${user.displayName} has been a member of this server since ${user.joinedAt}`,
            },
        }
    });
}

app.post('/roles/update',async (req,res)=>{
    const role_list = client.guilds.cache.first().roles.cache.array();
    for (const role of role_list) {
        if (role.name == '@everyone') continue;
        try {
            await firestore.collection(role_collection).doc(role.id).create({
                name: role.name,
                color: role.hexColor,
                assignable: false,
            });
            console.log('created ' + role.id + ' | ' + role.name);
        } catch(e) {

        }
    }
    return res.json({status:'success'});
});

app.get('/is-admin/:user_id',async (req,res)=>{
    try {
        const member = await client.guilds.cache.first().members.fetch(req.params.user_id);
        for (const role of member.roles.cache.array()) {
            if (role.name == 'Admins') {
                return res.json({
                    status:'success',
                    is_admin:true,
                });
            }
        }
    } catch {
        
    }
    return res.json({
        status:'success',
        is_admin:false,
    });
});

async function update_role_command() {

    const roles = await get_roles(true);
    try {
        // const role_result = await axios.post(`https://discord.com/api/v8/applications/${process.env.CLIENT_ID}/guilds/${process.env.GUILD_ID}/commands`,{
        //     name: 'role',
        //     description: 'Add or remove a role',
        //     options: [
        //         {
        //             name: 'add',
        //             description: 'Role to add',
        //             type:1,
        //             options:[
        //                 {
        //                     name: 'role',
        //                     description: 'Role to add',
        //                     type:'3',
        //                     required:true,
        //                     choices: roles
        //                 }
        //             ]
        //         },
        //         {
        //             name: 'remove',
        //             description: 'Role to remove',
        //             type:1,
        //             options:[
        //                 {
        //                     name: 'role',
        //                     description: 'Role to remove',
        //                     type:'3',
        //                     required:true,
        //                     choices: roles
        //                 }
        //             ]
        //         },
        //         {
        //             name: 'clear',
        //             description: 'Clear all given roles',
        //             type:1,
        //         }
        //     ]
        // },{
        //     headers: {
        //         Authorization: `Bot ${process.env.TOKEN}`
        //     }
        // });
        const say_result = await axios.post(`https://discord.com/api/v8/applications/${process.env.CLIENT_ID}/guilds/${process.env.GUILD_ID}/commands`,{
            name: 'role',
            description: 'Add or remove a role',
            options: [
                
            ]
        },{
            headers: {
                Authorization: `Bot ${process.env.TOKEN}`
            }
        });
        const user_result = null;
    } catch(e) {
        console.log(e.response.data);
    }
}

client.once('ready',()=>{
    if (client.guilds.cache.first().id == '484606200550260737') {// dev
        role_collection += '-dev';
    }
    //update_role_command();
});