import * as net from 'net';
import {DatabaseHelper} from './database-helper';

export class ShallowsServices {
    shallow_clients = {};
    uid_taken = {};
    dbh: DatabaseHelper;
    terms: String[];

    constructor (dbh: DatabaseHelper) {
        this.dbh = dbh;
        
    }
    public async update() {
        const term_lookup = await this.dbh.all('SELECT Term FROM ShallowTerm');
        for (const term in term_lookup) {
            this.terms.push(term_lookup[term].Term);
        }

    }

}
