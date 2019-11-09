import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function ss(g: any, dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    //const db = dbh.get_db();
    const shallow_terms: any[] = await dbh.all(`SELECT * FROM ShallowTerms`);
    res.render('site',{page:'ss',user:req.user, terms:shallow_terms});
}