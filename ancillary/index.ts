import {ShallowsServices} from './ss';
import {DatabaseHelper} from '../database-helper'
import * as express from 'express';
import * as discord from 'discord.js';

export class Services {
    ss: ShallowsServices;
    dbh: DatabaseHelper;
    app: express.Application;

    constructor(dbh: DatabaseHelper) {
        this.dbh = dbh;
        this.ss = new ShallowsServices(this.dbh);
    }

    public buzz(msg: String) {
        // this.ss.buzz();
    }
}