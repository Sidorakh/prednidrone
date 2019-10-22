import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function sb_signup(dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    const db = dbh.get_db();
    const user_stmt = db.prepare(`SELECT DiscordID FROM Spoons WHERE DiscordID == (?)`);
    //@ts-ignore
    const user_list = await dbh.stmt_all(user_stmt,req.user.id);
    if (user_list.length == 0) {
        res.render('site',{page:'./sb/signup.ejs',user:req.user});
    } else {
        res.redirect('/sb/')
    }
}