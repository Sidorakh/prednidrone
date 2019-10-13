import * as net from 'net';
import {DatabaseHelper} from './database-helper';
const uuid_taken: Object = {};
export class ShallowsServices {
    shallow_clients = {};
    dbh: DatabaseHelper;
    terms: String[];
    server: net.Server;
    constructor (dbh: DatabaseHelper) {
        this.dbh = dbh;
        this.server = net.createServer((sock:net.Socket) => {
            sock.on('data', (data) => {
                const payload = data.toString('utf8'); 
                const json: any = attempt(JSON.parse,payload);
                if (json instanceof Error) {
                    sock.destroy();
                    return;
                }
                
                switch (json.type) {
                    case "connect":
                        const uuid = generate_uuid();
                        //@ts-ignore
                        sock.uuid = uuid;
                        this.shallow_clients[uuid] = sock;
                        sock.write(JSON.stringify({
                            type:'uid',
                            uid:uuid
                        }));
                    break;
                    case "ping":
                        sock.write(JSON.stringify({
                            type:'ping',
                            ping:json.timestamp
                        }))
                    break;
                }
            });
            sock.on('error', (e) => {
                console.error(e);
            });
            sock.end('end', ()=>{
                //@ts-ignore
                delete shallow_clients[sock.uuid];
                sock.destroy();
            })
        });
    }
    public async update() {
        const term_lookup = await this.dbh.all('SELECT Term FROM ShallowTerm');
        for (const term in term_lookup) {
            this.terms.push(term_lookup[term].Term);
        }

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