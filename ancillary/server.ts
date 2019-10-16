import * as express from 'express';
import * as body_parser from 'body-parser';
import { DatabaseHelper } from '../database-helper';
import * as cookie_parser from 'cookie-parser';
import * as session from 'express-session';
import * as passport from 'passport';
import * as discord_strategy from 'passport-discord';
import * as pages from './pages';

const active_sessions = {};



export class ServerHandler {
    private dbh: DatabaseHelper;
    private app: express.Application;
    constructor( list_roles: (id: string)=>Promise<string[]>, port: string, dbh: DatabaseHelper) {
        
        // Page handler
        this.dbh = dbh;
        const page = (_page: (dbh: DatabaseHelper, req:express.Request, res:express.Response, next:express.NextFunction) => any) => {
            return (req: express.Request,res:express.Response,next:express.NextFunction)=>{
                _page(this.dbh,req,res,next);
            }
        }
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
        passport.serializeUser((user:any,done)=>{
            active_sessions[user.id] = user;
            done(null,user);
        });
        passport.deserializeUser((user:any,done)=>{
            done(null,active_sessions[user.id]);
        })



        const app: express.Application = express();
        app.use(cookie_parser());
        app.use(body_parser.json());
        app.use(body_parser.urlencoded({extended:false}));
        app.use(session({secret:process.env.EXPRESS_SECRET,resave:true,saveUninitialized:true}));
        app.use(passport.initialize());
        app.use(passport.session());
        app.use('/assets',express.static('./assets'));
        app.set('view engine', 'ejs');
        // GNU Terry Pratchett
        app.use((req: express.Request,res: express.Response,next: express.NextFunction)=>{
            res.set('X-Clacks-Overhead', 'GNU Terry Pratchett');
            next();
        });




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
        app.get('/callback', passport.authenticate('discord',{ failureRedirect: '/' }), (req, res) => {
            res.redirect('/')
        });


        // Roles

        app.use(async (req: express.Request,res: express.Response, next: express.NextFunction)=>{
            if (req.user) {
                //@ts-ignore
                const id = req.user.id;
                const user_roles: string[] = await list_roles(id);
                let role_id = 0;
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
                req.user.ss = false;

                const db = dbh.get_db()
                const stmt = db.prepare('SELECT * FROM ShallowsServices WHERE DiscordID=(?)');

                const result = await dbh.stmt_get(stmt,id);
                if (result) {
                    //@ts-ignore
                    req.user.ss = true;
                }

            }   
            next();
        });

        // Unauthroized allowed


        app.get('/',page(pages.home));
        

        // Authorization required


        app.listen(port);
    }
    public get_app(): express.Application {
        return this.app;
    }
}