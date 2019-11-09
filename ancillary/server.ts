import * as express from 'express';
import * as discord from 'discord.js';
import * as body_parser from 'body-parser';
import { DatabaseHelper } from '../database-helper';
import * as cookie_parser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as discord_strategy from 'passport-discord';
import * as pages from './pages';
import * as connect_sqlite3 from 'connect-sqlite3';
import * as cors from 'cors';
import * as rp from 'request-promise';

const active_sessions = {};



export class ServerHandler {
    private dbh: DatabaseHelper;
    private app: express.Application;
    constructor( list_roles: (id: string)=>Promise<string[] | Error>, port: string, dbh: DatabaseHelper, get_avatar: (id: string)=>Promise<discord.User | Error>, g: any) {
        
        // Page handler
        this.dbh = dbh;
        const db = dbh.get_db();
        const page = (_page: (g: any, dbh: DatabaseHelper, req:express.Request, res:express.Response, next:express.NextFunction) => any) => {
            return (req: express.Request,res:express.Response,next:express.NextFunction)=>{
                _page(g,this.dbh,req,res,next);
            }
        }
        ///@ts-ignore
        this.dbh.get_avatar = get_avatar;
        // Passport
        const auth_strategy = new discord_strategy ({
                clientID:process.env.CLIENT_ID,
                clientSecret:process.env.SECRET_ID,
                callbackURL:process.env.CALLBACK_URL
            },
            (access_token,refresh_token,profile,cb)=>{
                //@ts-ignore
                profile.refresh_token = refresh_token; 
                //@ts-ignore
                profile.access_token = access_token;
                const avatar_base = 'https://cdn.discordapp.com';
                let avatar_url = `${avatar_base}`;
                if (profile.avatar) {
                    avatar_url += `/avatars/${profile.id}/${profile.avatar}.${(profile.avatar.includes('a_')?'gif':'png')}`
                } else {
                    avatar_url += `/embed/avatars/${parseInt(profile.discriminator) % 5}.png`;
                }
                //@ts-ignore
                profile.avatar_url = avatar_url;
                cb(null,profile);
            }
        );

        passport.use(auth_strategy);
        passport.serializeUser(async (user:any,done)=>{
            //active_sessions[user.id] = user;
            const stmt_exist = db.prepare(`SELECT * FROM Sessions WHERE UserID=(?)`);
            const results = await dbh.stmt_all(stmt_exist,user.id);
            if (results.length > 0) {
                const stmt_update = db.prepare(`UPDATE Sessions SET SessionData=(?) WHERE UserID=(?)`);
                await dbh.stmt_run(stmt_update,JSON.stringify(user),user.id);
                stmt_update.finalize();
            } else {
                const stmt_insert = db.prepare(`INSERT INTO Sessions (UserID, SessionData) VALUES (?,?)`);
                await dbh.stmt_run(stmt_insert,user.id,JSON.stringify(user));
                stmt_insert.finalize();
            }
            done(null,user);
        });
        passport.deserializeUser(async (user:any,done)=>{
            //done(null,active_sessions[user.id]);
            try {
                const get_user = db.prepare(`SELECT * FROM Sessions WHERE UserID=(?)`);
                done(null,JSON.parse( (await dbh.stmt_get(get_user,user.id)).SessionData));
            } catch(e) {
                done(e,false);
            }
        });


        const SQLite3Store = connect_sqlite3(session);
        const app: express.Application = express();
        app.use(cookie_parser());
        app.use(body_parser.json());
        app.use(body_parser.urlencoded({extended:false}));
        app.use(session({secret:process.env.EXPRESS_SECRET,resave:true,saveUninitialized:true,store: new SQLite3Store({db:'sessions.db'})}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use('/assets',express.static('./assets'));
        app.set('view engine', 'ejs');


        

        // GNU Terry Pratchett
        app.use((req: express.Request,res: express.Response,next: express.NextFunction)=>{
            res.set('X-Clacks-Overhead', 'GNU Terry Pratchett');
            next();
        });

        const auth_role = (min_level: Number, redirect_url: string = '/') => {
            return (req: express.Request,res:express.Response,next:express.NextFunction)=>{
                //@ts-ignore
                if (req.user.role_id >= min_level) {
                    next();
                } else {
                    res.redirect(redirect_url);
                }
            }
        }


        const auth = (async (req: express.Request,res: express.Response, next: express.NextFunction)=>{
            if (req.user) {
                //@ts-ignore
                const id = req.user.id;
                const user_roles: string[] | Error = await list_roles(id);
                let role_id = -10
                
                if (user_roles instanceof Error) {
                    console.log('Error on obtaining user roles - maybe they aren\'t uin the Thritis discord server')
                    role_id = -1;

                    return next();
                }

                if (user_roles.indexOf('Channel Host') > 0) {
                    role_id = 1;
                }
                if (user_roles.indexOf('Chat Mods') > 0) {
                    role_id = 2;
                }
                if (user_roles.indexOf('Admins') > 0) {
                    role_id = 3;
                }
                
                //@ts-ignore
                req.user.role_id = role_id

                //@ts-ignore
                req.user.ss = true;

                const db = dbh.get_db()
                const stmt = db.prepare('SELECT * FROM ShallowsServices WHERE DiscordID=(?)');

                const result = await dbh.stmt_get(stmt,id);
                
                if (result) {
                    //@ts-ignore
                    req.user.ss = true;
                } else {
                    //@ts-ignore
                    req.user.ss = false;
                }
            }
            next();
        });

        app.all('*',auth);

        // passport/login
        app.get('/login',(req,res)=>{
            res.redirect(process.env.AUTH_URL);
        });
        app.get('/logout',(req,res)=>{
            if (req.user == undefined) {
                res.redirect('/login');
            } else {
                req.logout();
                res.redirect('/');
            }
        });
        app.get('/callback', passport.authenticate('discord',{ failureRedirect: '/'}),auth,(req,res)=>{
            res.redirect('/');
        });


        // Roles


        // Unauthroized allowed


        app.get('/',page(pages.home));
        



        // Require account (Spoonbank)
        app.all('/sb/*',(req,res,next) => {
            // @ts-ignore
            if (req.user && req.user.role_id > -1) {
                next();
            } else {
                res.redirect('/');
            }
        });

        app.get('/sb/',page(pages.sb_home));
        app.get('/sb/signup',page(pages.sb_signup));
        app.post('/sb/signup',async (req,res)=>{
            //@ts-ignore
            const user_id = req.user.id;
            const signup_check = db.prepare(`SELECT * FROM Spoons WHERE DiscordID = (?)`);
            const account = await dbh.stmt_get(signup_check,user_id);
            signup_check.finalize();
            if (!account) {
                const signup_stmt = db.prepare(`INSERT INTO Spoons (DiscordID, Balance) VALUES (?, 5000)`);
                await dbh.stmt_run(signup_stmt,user_id);
                res.redirect('/sb/?signup=1');
            } else {
                res.redirect('/sb/')
            }
        });
        app.post('/sb/send',async(req,res)=>{
            //@ts-ignore
            const user_id = req.user.id;
            const signup_check = db.prepare(`SELECT * FROM Spoons WHERE DiscordID = (?)`);
            const sender = await dbh.stmt_get(signup_check,user_id);
            const recipient = await dbh.stmt_get(signup_check,req.body.recipient);
            signup_check.finalize();

            if (!sender) {
                return res.json({
                    status:'failure',
                    reason:'Sender account'
                });
            }
            if (!recipient) {
                return res.json({
                    status:'failure',
                    reason:'Recipient does not exist'
                });
            }

            const stmt_transaction_stmt = db.prepare(`INSERT INTO Transactions VALUES (?,?,?,?,?)`);
            
            
            


        });
        // Hosts+
        app.all('/hosts/*',(req,res,next) => {
            // @ts-ignore
            if (req.user && req.user.role_id > 0) {
                next();
            } else {
                res.redirect('/');
            }
        });


        // Mods+

        // Admins+
        app.all('/admin*',(req,res,next) => {
            // @ts-ignore
            if (req.user && req.user.role_id >= 3) {
                next();
            } else {
                res.redirect('/');
            }
        });
        app.get('/admin',page(pages.admin_home));
        app.get('/admin/roles',page(pages.admin_roles));


        app.post('/admin/roles/add',async(req,res)=>{
            const role_id = req.body.role_id;
            const stmt_check = db.prepare(`SELECT * FROM AvailableRoles WHERE RoleID=(?)`);
            if ((await dbh.stmt_all(stmt_check,role_id)).length > 0) {
                stmt_check.finalize();
                return res.redirect('/roles?error=1')   // role already available
            } else {
                stmt_check.finalize();
            }
            const role = g.get_role(role_id);
            if (role == null) {
                return res.redirect('/roles?error=2');  // role doesn't exist
            }
            const stmt = db.prepare(`INSERT INTO AvailableRoles (RoleID) VALUES (?)`);
            await dbh.stmt_run(stmt,role_id);
            stmt.finalize();
            res.redirect('/admin/roles?success=1');
        });

        app.post('/admin/roles/delete',async (req,res)=>{
            const role_id = req.body.role_id;
            const stmt_check = db.prepare(`SELECT * FROM AvailableRoles WHERE RoleID=(?)`);
            if ((await dbh.stmt_all(stmt_check,role_id)).length == 0) {
                stmt_check.finalize();
                return res.redirect('/admin/roles?error=3')   // role not available
            } else {
                stmt_check.finalize();
            }
            const role = g.get_role(role_id);
            if (role == null) {
                return res.redirect('/admin/roles?error=2');  // role doesn't exist
            }
            const stmt = db.prepare(`DELETE FROM AvailableRoles WHERE RoleID = (?)`);
            await dbh.stmt_run(stmt,role_id);
            stmt.finalize();
            res.redirect('/admin/roles?success=2');
        });

        //Shallow's Services
        app.get('/ss/*',(req,res,next)=>{
            // @ts-ignore
            if (req.user && req.user.ss) {
                return next();
            }
            return res.redirect('/');
        });

        app.get('/ss/',(req,res,next)=>{
            page(pages.ss)(req,res,next);
        });

        app.delete('/ss/keyword/delete/:keyword',async (req,res)=>{
            if (parseInt(req.params.keyword) != NaN) {
                const stmt = db.prepare(`DELETE FROM ShallowTerms WHERE TermID = (?)`);
                await dbh.stmt_run(stmt,req.params.keyword);
            }
            res.send(JSON.stringify({
                status:'success',
                msg:`deleted keyword ID ${req.params.keyword}`
            }));
        });

        app.post('/ss/keyword/add',async (req,res,next)=>{
            const keyword = req.body.keyword.toLowerCase();
            const stmt = db.prepare(`SELECT * FROM ShallowTerms WHERE Term=(?)`);
            
            const result = await dbh.stmt_all(stmt,keyword);
            let response = "";
            console.log(`Length: ${result.length}`);
            console.log(req.headers.host);
            if (result.length == 0) {
                const stmt_insert = db.prepare(`INSERT INTO ShallowTerms (Term) VALUES (?)`);
                await dbh.stmt_run(stmt_insert,keyword);
                stmt_insert.finalize();
                
                const stmt_term = db.prepare(`SELECT * FROM ShallowTerms WHERE Term=(?)`);
            
                const new_result = await dbh.stmt_get(stmt_term,keyword)
            
                console.log(result);
                stmt.finalize();
                response = (JSON.stringify({
                    status:"success",
                    id: new_result.TermID,
                    term: new_result.Term
                }));
            } else {
                response = (JSON.stringify({
                    status:"failure"
                }));
            }
            res.send(response);
        });


        app.listen(port);
    }
    public get_app(): express.Application {
        return this.app;
    }
}