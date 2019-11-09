import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function admin_home(g: any, dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    const db = dbh.get_db();
    
    res.render('site',{page:'admin/index',user:req.user});
}