import firebase from './firebase';
import {ENVIRONMENT} from './env';
import client from './discord-client';
import * as discord from 'discord.js';

export async function get_roles() {
    const guild = client.guilds.cache.first()!;
    const collection = ENVIRONMENT == 'DEV' ? 'prednidrone-dev' : 'prednidrone'
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
    const guild = client.guilds.cache.first()!;
    const snowflakes: string[] = await get_config('pronouns');
    const roles: discord.Role[] = [];
    for (const snowflake of snowflakes) {
        const role = await guild.roles.fetch(snowflake);
        if (role) {
            roles.push(role)
        }
    }
    return roles;
}

export async function get_config(key: string) {
    const collection = ENVIRONMENT == 'DEV' ? 'prednidrone-dev' : 'prednidrone';
    const doc = (await firebase.firestore().collection(collection).doc('settings').get());
    return doc.data()![key];

}
export async function set_config(key: string, value: string) {
    const collection = ENVIRONMENT == 'DEV' ? 'prednidrone-dev' : 'prednidrone';
    await firebase.firestore().collection(collection).doc('settings').update({
        [key]: value,
    });
    
}