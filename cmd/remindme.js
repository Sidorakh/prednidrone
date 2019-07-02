const agenda = require('agenda');
const reminders = new agenda({db:{address:'localhost:27017'},processEvery:'1 minute',maxConcurrency:8192});
let guild = null;

module.exports.init = (g) => {
    guild = g;
}

reminders.define('remind',async (job, done)=>{
    console.log(job.attrs.data);
    try {
        let user = await guild.fetchMember(job.attrs.data.id,false);
        user.send(job.attrs.data.reason);
    } catch(e) {
        console.log(`${job.attrs.data.id} doesn't exist`);
    }
    
})

module.exports.description = {
    name:"remindme",
    description:"Remind you about something!",
    usage: "`!remindme <time> <unit> <reminder>`",
    parameters: [
        {
            name:"time",
            description:"An amount of time (eg: 5 weeks - 5 is the amount)"
        },
        {
            name:"unit",
            description:"The unit of time (eg: 5 weeks - weeks is the unit)"
        },
        {
            name:"reminder",
            description:"What the bot should remind you about"
        }
    ]
}
module.exports.call = async(client,global,msg,args) => {
    let time = args.shift();
    let unit = args.shift();
    let reason = args.join(' ');
    let multi = 1000*60*60;
    switch (unit.toLowerCase()) {
        case 'second':
        case 'seconds':
            multi = 1000;
        break;
        case 'minute':
        case 'minutes':
            multi = 1000*60;
        break;
        case 'hour':
        case 'hours':
            multi = 1000*60*60
        break;
        case 'day':
        case 'days':
            multi = 1000*60*60*24
        break;
        case 'week':
        case 'weeks':
            multi = 1000*60*60*24*7
        break;
    }
    let end_time = new Date(Date.now() + time*multi);
    console.log(reminders.schedule(end_time,'remind',{id:msg.author.id,reason:reason}));
    
}