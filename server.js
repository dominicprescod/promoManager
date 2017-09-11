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
        client.connect()
            .then(()=>{
                client.query(psql("users").toString(), (err, result) => {
                    if (err) {
                        console.log("error getting all users");
                        console.log(err);
                        disconnect(client);
                    } else {
                        console.log("success getting all users");
                        var activeUser = result.rows;
                        activeUser = activeUser.filter((v, i, a) => v.active);
                        console.log(activeUser);
                        if (activeUser.length) {
                            console.log("activeUser.length");
                            disconnect(client);
                            req.logout();
                            // disconnect(client);
                            res.redirect("/");
                        } else {
                            console.log("did not find an active user");
                            client.query(psql("users").update('active', true).where('id', req.user.id).toString(), (uErr, uRes) => {
                                if (uErr) {
                                    console.log('problem updating user to active user');
                                    console.log(uErr);
                                    disconnect(client);
                                } else {
                                    req.user.active = true;
                                    console.log('success making user active');
                                    console.log(uRes);
                                    disconnect(client);
                                    res.redirect("/login.html");
                                }
                            });
                        }
                    }
                });
            })
            .catch((connectError)=>{
                console.log("cannot connect to PSQL");
                console.log(connectError.stack);
            });
    });

    app.get("/logout",(req, res)=>{
        console.log('inside logout');
        console.log(req.user);
        if(req.user.active){
            console.log("inside req.user.active")
            client.connect()
                .then(()=> {
                    client.query(
                        psql("users").update("active", false).where("id", req.user.id).toString(),
                        (err, res) => {
                            if (err) {
                                console.log('problem setting user to inactive');
                                console.log(err);
                                disconnect(client);
                            } else {
                                console.log("success setting user to inactive");
                                console.log(res);
                                disconnect(client);
                            }
                        });
                })
                .catch(e => console.log("problem connecting\n"+e.stack));
        }
        req.logout();
        res.redirect("/");
    });

    app.get("/parser/:reqres", (req, res)=> {
        const stuff = require("./xml.js")(req.params.reqres);
        console.log(stuff);
        res.send(stuff);
    });

// getting the cookie from the client side
    app.get('/api/user_data', function (req, res) {

        if (req.user === undefined) {
            // The user is not logged in
            res.json({});
        } else {
            res.json({
                username: req.user
            });
        }
    });
 
    http.listen(port,()=>{
        console.log("listening on port: "+port);
        // client.connect();
    });

module.exports = app;