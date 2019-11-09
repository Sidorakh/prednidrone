import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function home(g:any, dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    //const db = dbh.get_db();
    
    res.render('site',{page:'index',user:req.user});
}