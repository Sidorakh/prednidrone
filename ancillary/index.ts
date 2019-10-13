import {ShallowsServices} from './ss';
import {DatabaseHelper} from '../database-helper'
import * as express from 'express';
import * as discord from 'discord.js';
import {ServerHandler} from './server';

export class Services {
    ss: ShallowsServices;
    dbh: DatabaseHelper;
    app: ServerHandler;
    list_roles: (id: string) => string;     // function definition

    constructor(dbh: DatabaseHelper, list_roles: (id: string)=>string[], port:string) {
        this.dbh = dbh;
        this.ss = new ShallowsServices(this.dbh);
        this.app = new ServerHandler(list_roles, port);
    }

    public buzz(msg: String) {
        // this.ss.buzz();
    }
}