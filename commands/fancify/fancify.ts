import * as discord from 'discord.js';
import {lut} from './lookup';
const upper = lut.alphabet[0];
const lower = lut.alphabet[1];
import {DatabaseHelper} from '../../database-helper';
export async function command(client: discord.Client, dbh:DatabaseHelper, msg: discord.Message, args: String[]) {
    const type = args.shift().toLowerCase();
    if (lut[type] != undefined) {
        let new_msg = "";
        const lookup = lut[type];
        args.join(' ').split('').forEach(c=>{
            if (upper.indexOf(c) != -1) {
                new_msg += lookup[0][upper.indexOf(c)];
            } else if (lower.indexOf(c) != -1) {
                new_msg += lookup[1][lower.indexOf(c)];
            } else {
                new_msg += c;
            }
        });
        if (type === "australian") {
            new_msg = new_msg.split('').reverse().join('');
        }
        return new_msg;
    }
    msg.author.send(`${type} is not a valid type`);
    return "";
}   