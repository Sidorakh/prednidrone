
import * as discord from 'discord.js';
import {ApplicationCommandInteraction} from '../interaction-typedefs';
export const command: ApplicationCommandInteraction = {
    command: new discord.SlashCommandBuilder()
                        .setName('fancify')
                        .setDescription('Make text fancy')
                        .addStringOption(v=>v.setName('mode')
                                                .setDescription('Mode to use')
                                                .setChoices({
                                                    name:'Ye Olde',
                                                    value: 'yeolde',
                                                },{
                                                    name: 'Cursive',
                                                    value: 'cursive',
                                                },{
                                                    name: 'Stroke',
                                                    value: 'stroke',
                                                },{
                                                    name: 'Upside-down',
                                                    value: 'upside_down'
                                                }).setRequired(true))
                        .addStringOption(v=>v.setName('text').setDescription('The text to change').setRequired(true)),
    handler: async (interaction)=>{
        const mode = interaction.options.getString('mode')! as 'alphabet'|'yeolde'|'cursive'|'stroke'|'upside_down';
        const text = interaction.options.getString('text')!;

        const msg = [...text].map(v=>{
            const upper = lookup.alphabet[0];
            const lower = lookup.alphabet[1];
            if (upper.indexOf(v) != -1) {
                return lookup[mode][0][upper.indexOf(v)];
            }
            if (lower.indexOf(v) != -1) {
                return lookup[mode][1][lower.indexOf(v)];
            }
            return v;
        });
        if (mode == 'upside_down') {
            msg.reverse();
        }
        interaction.reply({content: msg.join(''),allowedMentions: {parse:[]}});
    },
    description: 'Send fancy text',
    parameters: [],

}



const lookup = {
    alphabet:[
        ["A","B","C","D","E","F","G","H","I","J","K","L","M","N","O","P","Q","R","S","T","U","V","W","X","Y","Z"],
        ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"]
    ],
    yeolde:[
        ["𝔄","𝔅","ℭ","𝔇","𝔈","𝔉","𝔊","ℌ","ℑ","𝔍","𝔎","𝔏","𝔐","𝔑","𝔒","𝔓","𝔔","ℜ","𝔖","𝔗","𝔘","𝔙","𝔚","𝔛","𝔜","ℨ"],
        ["𝔞","𝔟","𝔠","𝔡","𝔢","𝔣","𝔤","𝔥","𝔦","𝔧","𝔨","𝔩","𝔪","𝔫","𝔬","𝔭","𝔮","𝔯","𝔰","𝔱","𝔲","𝔳","𝔴","𝔵","𝔶","𝔷"]
    ],
    cursive:[
        ["𝓐","𝓑","𝓒","𝓓","𝓔","𝓕","𝓖","𝓗","𝓘","𝓙","𝓚","𝓛","𝓜","𝓝","𝓞","𝓟","𝓠","𝓡","𝓢","𝓣","𝓤","𝓥","𝓦","𝓧","𝓨","𝓩"],
        ["𝓪","𝓫","𝓬","𝓭","𝓮","𝓯","𝓰","𝓱","𝓲","𝓳","𝓴","𝓵","𝓶","𝓷","𝓸","𝓹","𝓺","𝓻","𝓼","𝓽","𝓾","𝓿","𝔀","𝔁","𝔂","𝔃"]
    ],
    stroke:[
        ["卂","乃","匚","ᗪ","乇","千","Ꮆ","卄","丨","ﾌ","Ҝ","ㄥ","爪","几","ㄖ","卩","Ɋ","尺","丂","ㄒ","ㄩ","ᐯ","山","乂","ㄚ","乙"],
        ["卂","乃","匚","ᗪ","乇","千","Ꮆ","卄","丨","ﾌ","Ҝ","ㄥ","爪","几","ㄖ","卩","Ɋ","尺","丂","ㄒ","ㄩ","ᐯ","山","乂","ㄚ","乙"]
    ],
    upside_down:[
        ["∀","ᙠ","Ɔ","ᗡ","Ǝ","Ⅎ","⅁","H","I","ſ","⋊","˥","W","N","O","Ԁ","Ό","ᴚ","S","⊥","∩","Λ","M","X","⅄","Z"],
        ["ɐ","q","ɔ","p","ǝ","ɟ","ɓ","ɥ","ı","ɾ","ʞ","l","ɯ","u","o","d","b","ɹ","s","ʇ","n","ʌ","ʍ","x","ʎ","z"]
    ]
}