import * as discord from 'discord.js';
import {DatabaseHelper} from '../../database-helper';
export async function command(g:any, dbh:DatabaseHelper, msg: discord.Message, args: String[]) {
    return args.join(' ');
}  
export const data = {
    name:'say',
    description:'Make the bot say words',
    usage:'!say <TEXT>',
    parameters:[
        {
            name:'text',
            description:'What the bot should say'
        }
    ]
}