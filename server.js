var express                 = require("express"),
    app                     = express(),
    session                 = require('express-session'),
    cookieParser            = require('cookie-parser'),
    passport                = require('passport'),
    bodyParser              = require('body-parser'),
    disconnect              = require("./disconnect.js"),
    ELASTIC                 = require('elasticsearch'),
    creds                   = require(process.env.HOME+"/.creds/node/credentials.js"),
    dbURL                   = process.env.DATABASE_URL || 'postgres://localhost:5432/soap',
    searchPath              = process.env.SEARCH_PATH || 'soap,public',
    psql                    = require('knex')({
                                client: 'pg',
                                connection: dbURL,
                                searchPath: searchPath
                            }),
    http                    = require('http').Server(app),
    io                      = require('socket.io')(http),
    port                    = process.env.PORT || 3000;

    const {Pool, Client} = require('pg');
    const client = new Client({
        user: creds.soap.psql.userName,
        password: creds.soap.psql.password,
        database: 'soap',
        port: 5432
    });

    // Middleware
    // =============================================================================
    
    require('./config/passport.js')(passport);
    app.use(cookieParser());
    app.use(express.static('public'));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // required for passport
    app.use(session({secret: "ilovescotchscotchyscotchscotch"}));
    app.use(passport.initialize());
    app.use(passport.session());
    

    // Google OAuth2
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
                client.query(psql("users").toString(), (err, result) => {
                    if (err) {
                        console.log("error getting all users");
                        console.log(err);
                    } else {
                        console.log("success getting all users");
                        var activeUser = result.rows;
                        activeUser = activeUser.filter((v, i, a) => v.active);
                        console.log(activeUser);
                        if (activeUser.length) {
                            console.log("activeUser.length");
                        
                            req.logout();
                        
                            res.redirect("/");
                        } else {
                            console.log("did not find an active user");
                            client.query(psql("users").update('active', true).where('id', req.user.id).toString(), (uErr, uRes) => {
                                if (uErr) {
                                    console.log('problem updating user to active user');
                                    console.log(uErr);
                        
                                } else {
                                    req.user.active = true;
                                    console.log('success making user active');
                                    console.log(uRes);
                        
                                    res.redirect("/login.html");
                                }
                            });
                        }
                    }
                });
    });

    app.get("/logout",(req, res)=>{
        
        if(req.user.active){
        
                    client.query(
                        psql("users").update("active", false).where("id", req.user.id).toString(),
                        (err, res) => {
                            if (err) {
                                console.log('problem setting user to inactive');
                                console.log(err);
        
                            } else {
                                console.log("success setting user to inactive");
                                console.log(res);
        
                            }
                        });
        }
        req.logout();
        res.redirect("/");
    });

    app.get("/parser/:reqres", (req, res)=> {
        const stuff = require("./xml.js")(req.params.reqres);
        console.log(stuff);
        res.send(stuff);
    });
 
    http.listen(port,()=>{
        console.log("listening on port: "+port);
        // trying to connect once
        client.connect()
            .then(() => {
                console.log("connected to PSQL in serverjs");
            })
            .catch(e => console.log("problem connecting to PSQL in serverjs: \n" + e.stack));

    });

module.exports = app;