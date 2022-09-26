import firebase from './firebase';
import {GUILD_ID} from './env';
import client from './discord-client';
import * as discord from 'discord.js';

export async function get_roles() {
    const collection = GUILD_ID == '484606200550260737' ? 'prednidrone-dev' : 'prednidrone'
    const guild = await client.guilds.fetch(GUILD_ID);
    const doc = (await firebase.firestore().collection(collection).doc('settings').get());
    const snowflakes: string[] = doc.data()!.roles;
    const roles: discord.Role[] = [];
    for (const snowflake of snowflakes) {
        const role = await guild.roles.fetch(snowflake);
        if (role) {
            roles.push(role)
        }
    }
    return roles;
}

export async function get_pronouns() {
    const collection = GUILD_ID == '484606200550260737' ? 'prednidrone-dev' : 'prednidrone';
    const guild = await client.guilds.fetch(GUILD_ID);
    const doc = (await firebase.firestore().collection(collection).doc('settings').get());
    const snowflakes: string[] = doc.data()!.pronouns;
    const roles: discord.Role[] = [];
    for (const snowflake of snowflakes) {
        const role = await guild.roles.fetch(snowflake);
        if (role) {
            roles.push(role)
        }
    }
    return roles;
}