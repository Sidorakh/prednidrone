import * as express from 'express';
import {DatabaseHelper} from '../../../database-helper';
export async function admin_roles(g: any, dbh: DatabaseHelper, req: express.Request,res: express.Response, next: express.NextFunction) {
    const db = dbh.get_db();
    const available_roles = [];
    const result = await dbh.all(`SELECT * FROM AvailableRoles`);
    for (let i=0;i<result.length;i++) {
        const role = g.get_role(result[i].RoleID);
        available_roles.push(role);
    }
    res.render('site',{page:'admin/roles',role_list:g.get_roles(),available_roles:available_roles,user:req.user,query:req.query});
}