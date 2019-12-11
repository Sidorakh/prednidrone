import * as net from 'net';
import {DatabaseHelper} from '../database-helper';
const uuid_taken: Object = {};
export class ShallowsServices {
    shallow_clients = {};
    dbh: DatabaseHelper;
    terms: String[];
    server: net.Server;
    regex: RegExp;

    constructor (dbh: DatabaseHelper) {
        this.dbh = dbh;
        this.update();
        console.log('Pre-server');
        const server = net.createServer((socket:net.Socket) => {
            socket.on('data',(data)=>{
                let payload = data.toString('utf8');
                let json: any = {};
                try {
                    json = attempt(JSON.parse,payload);
                } catch(e) {
                    socket.destroy();
                }
        
                switch (json.type) {
                    case "connect":
                        let uid = generate_uuid();
                        //@ts-ignore
                        socket.uid = uid;
                        this.shallow_clients[uid] = socket;
                        socket.write(JSON.stringify({type:'uid',uid:uid}));
                    break;
                    case "ping":
                        socket.write(JSON.stringify({type:"ping",ping:json.timestamp}));
                    break;
                }
            });
            socket.on('error', (e) => {
                //@ts-ignore
                delete this.shallow_clients[socket.uid];
                socket.destroy();
                console.error(e);
            });
            socket.on('end', function() {
                socket.destroy()
            });
        });
        server.listen(8008);
    };
    public buzz(msg: string) {
        //console.log(`SS - ${msg}`);
        const amt = msg.match(this.regex)
        if (amt) {
            console.log(amt.length);
            const payload = JSON.stringify({
                type:'buzz',
                amt:amt.length
            });
            for (const c in this.shallow_clients) {
                this.shallow_clients[c].write(payload);
            }
        }
    }
    public async update() {
        const term_lookup = await this.dbh.all('SELECT * FROM ShallowTerms');
        this.terms = [];
        for (const term in term_lookup) {
            this.terms.push(term_lookup[term].Term);
        }
        this.regex = new RegExp(this.terms.join('|'),'gi');
        console.log(this.regex);
    }

}


const attempt = (func: Function, ...args: any) => {
    try {
        return func(...args);
    } catch(e) {
        return (e instanceof Error ? e : new Error(e));
    }
}

const generate_uuid = () => {
    let taken: Boolean = true;
    let new_uuid: any;
    while (taken == true) {
        new_uuid = "xxxxxxxx-xxxx-4xxx-xxxx-xxxxxxxxxxxx".replace(/x/g,()=>{
            return (Math.floor(Math.random()*16)).toString(16);
        });
        if (uuid_taken[new_uuid] == undefined) {
            uuid_taken[new_uuid] = true;
            taken = false;
        }
    }
    return new_uuid;
}