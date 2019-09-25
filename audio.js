const youtubedl = require('youtube-dl');
const util = require('util');

const youtube_info_async = util.promisify(youtubedl.getInfo);

let volume = 100;
let dispatch = null;
let queue = [];
let current_connection = null;

module.exports.play = async (client, global, msg, args) => {
    let video = args[0];
    try {
        if (msg.member.voiceChannel) {
            current_connection = await msg.member.voiceChannel.join();
        } else {
            return "You must be in a voice channel to do that!";
        }
    } catch(e) {
        console.error(e);
        return "An error occured when trying to join the voice channel";
    }
    let info;
    try {
        info = await youtube_info_async(video, ['-q', '--no-warnings', '--force-ipv4']);
    } catch(e) {
        return "An error occured adding the requested item";
    }

    if (info.format_id === undefined || info.format_id.startsWith('0')) {
        return "Invalid video data found";
    }

    queue.push(info);

    if (queue.length == 1) {
        process_queue();
    }
    return "Song queued successfully!";
}

module.exports.disconnect = async(client,global,msg,args) => {
    if (current_connection) {
        current_connection.disconnect();
        current_connection = null;
        queue = [];
    }
}

module.exports.volume = async (client,global,msg,args) => {
    let v = args[0];
    v = typeof v === 'string' ? parseFloat(v) : v;

    // Make sure the number we have is within 0 - 100 and is an actual number
    if (isNaN(v) || (v < 0 || v > 100)) return 'Invalid value for volume!';

    volume = v;
    if (dispatch) dispatch.setVolume(volume * 0.01);

    return `Volume set to ${volume}%!`;
}

module.exports.skip = async (client,global,msg,args) => {
    dispatch.end();
    return `Skipped successfully`;
}

const process_queue = async () => {
    if (queue.length === 0) {
        module.exports.disconnect();
        return false; // Nothing in the queue.. lets fuck off
    }
    if (!current_connection) {
        module.exports.disconnect();
        return;
    }
    let next = queue[0];
    dispatch = current_connection.playStream(
        youtubedl(next.url, ['-x', '--audio-quality', '0']), { volume: volume * 0.01 }
    );
    dispatch.on('error',(err)=>{
        // Something died
        queue.shift();
        process_queue();
    });
    dispatch.on('end',()=>{
        // Shit finished
        queue.shift();
        process_queue();
    })
}

/*
module.exports.join = (msg) => {
    if (msg.member) {
        if (msg.member.voiceChannel) {
            msg.member.voiceChannel.join();
        }
    }
}
*/