import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function sb_home(g: any, dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    const db = dbh.get_db();
    //@ts-ignore
    let id = req.user.id;
    const user_account = db.prepare(`SELECT * FROM Spoons WHERE DiscordID = (?)`);
    const account = await dbh.stmt_get(user_account,id);
    if (!account) {
        return res.redirect('/sb/signup');
    }
    const signup_msg:Boolean = ( req.query.signup == 1 ? true : false);
    
    const user_stmt = db.prepare(`SELECT DiscordID FROM Spoons WHERE DiscordID != (?)`);
    
    const user_list = await dbh.stmt_all(user_stmt,id);
    let users = [];
    for (let i=0;i<user_list.length;i++) {
        //@ts-ignore
        users.push(dbh.get_avatar(user_list[i].DiscordID));
    }
    let new_user_list = await Promise.all(users);
    res.render('site',{page:'./sb/index.ejs',user:req.user,user_list:new_user_list, show_signup:signup_msg, user_account:account});
}