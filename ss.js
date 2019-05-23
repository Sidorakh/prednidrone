const net = require('net');
let shallow_clients = {};
let uid_taken={};

let shallow_terms = ["flare","pain","left","knee"];
let regex = new RegExp(shallow_terms.join('|'),'gi');

const server = net.createServer(socket=>{
    socket.on('data',(data)=>{
        let payload = data.toString('utf8');
        let json = {};
        try {
            json = attempt(JSON.parse,payload);
        } catch(e) {
            socket.destroy();
        }

        switch (json.type) {
            case "connect":
                let uid = generate_uid();
                socket.uid = uid;
                shallow_clients[uid] = socket;
                socket.write(JSON.stringify({type:'uid',uid:uid}));
            break;
            case "ping":
                socket.write(JSON.stringify({type:"ping",ping:json.timestamp}));
            break;
        }
    });
    socket.on('error', (e) => {
        console.error(e);
    });
    socket.on('end', function() {
        socket.destroy()
    });
})
server.listen(8008);


const attempt = (func, ...arguments) => {
    try {
        return func(...arguments);
    } catch (e) {
        return e;
    }
}
function generate_uid(){
    var taken = true;
    let new_uid;
    while (taken == true) {
        new_uid = "xxxx-xxxx-xxxx-xxxx".replace(/x/g,function (c) {
            return (Math.floor(Math.random()*16)).toString(16);
        });

        if (uid_taken[new_uid] == undefined) {
            uid_taken[new_uid] = true;
            taken = false;
        }
    }
    return new_uid;
}


module.exports.buzz = (msg) => {
    let amt = (msg.match(regex));//.length;
    if (amt) {
        amt = amt.length;
    } else {
        return;
    }

    let payload=JSON.stringify({type:"buzz",amt:amt});
    for (const c of shallow_clients) {
        c.write(payload);
    }
}