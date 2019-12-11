import * as discord from 'discord.js';
import {DatabaseHelper} from '../../database-helper';
export async function command(client: discord.Client, dbh:DatabaseHelper, msg: discord.Message, args: String[]) {
    const poll = {
        question:'',
        options:[]
    };
    const embed = {
        title:(msg.member ? msg.member.displayName : msg.author.username),
        description:""
    };
    //@ts-ignore
    const cl_msg: discord.Message = await msg.author.send('What would you like to poll?');
    const collector = cl_msg.channel.createMessageCollector(m=>m.author.id == msg.author.id);
    collector.on('collect',async(m)=>{
        const num = ["1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟"];
        if (m.content.includes('!stop') || poll.options.length > 9) {
            collector.stop()
            embed.description = poll.question + "\n\n";
            for (const q in poll.options) {
                embed.description += num[q] + ". " + poll.options[q] + "\n\n";
            }
            embed.description += "Record your response by reacting to this message";
            await cl_msg.channel.send(`The poll will appear as follows`);
            await cl_msg.channel.send({embed:embed});
            //@ts-ignore
            const answer_msg: discord.Message = await cl_msg.channel.send('Is this correct? React with :regional_indicator_y: for yes or :regional_indicator_n: for no');
            await answer_msg.react('🇾');
            await answer_msg.react('🇳');
            const emoji_collector = answer_msg.createReactionCollector( (reaction,user)=>(reaction.emoji.name=="🇾" || reaction.emoji.name=="🇳") && user.id == msg.author.id);
            emoji_collector.on('collect',async (r)=>{
                emoji_collector.stop();
                if (r.emoji.name=="🇾") {
                    // do thing
                    //@ts-ignore
                    const poll_msg: discord.Message = await msg.channel.send({embed:embed});
                    for (const q in poll.options) {
                        await poll_msg.react(num[q]);
                    }
                } else if (r.emoji.name=="🇳")  {
                    // cancel
                    cl_msg.channel.send('Poll has been cancelled');
                }
            })
            
        } else {
            if (poll.question == '') {
                poll.question = m.content;
                cl_msg.channel.send('Enter possible responses. Type `!stop` to finish. Maximum of 10');
            } else {
                poll.options.push(m.content);
            }
        }
    });
    return null;
}
