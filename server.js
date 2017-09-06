var express                 = require("express"),
    app                     = express(),
    session                 = require('express-session'),
    cookieParser            = require('cookie-parser'),
    passport                = require('passport'),
    // AWS                     = require('aws-sdk'),
    bodyParser              = require('body-parser'),
    ELASTIC                 = require('elasticsearch'),
    creds                   = require(process.env.HOME+"/.creds/node/credentials.js"),
    dbURL                   = process.env.DATABASE_URL || 'postgres://localhost:5432/soap',
    searchPath              = process.env.SEARCH_PATH || 'soap,public',
    // pg                      = require('pg'),
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
    })
    // pg.defaults.ssl = (process.env.DATABASE_SSL == 'true') ? true : undefined;


    // Middleware
    // =============================================================================
    app.use(cookieParser())
    app.use(express.static('public'));
    app.use(bodyParser.json({ limit: '50mb' }));
    app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
    // required for passport
    app.use(session({secret: process.env.FOO_COOKIE_SECRET || "ilovescotchscotchyscotchscotch"}));
    app.use(passport.initialize());
    app.use(passport.session());
    require('./config/passport.js')(passport);

    // Google
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    // the callback after google has authenticated the user
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }), (req, res) => {
        res.redirect('/loggedin')
    });


    



    http.listen(port,()=>{
        console.log("listening on port: "+port);
        // console.log(process.env)
        // connecting to PSQL
        client.connect()
        
        client.end()

        // console.log(creds)
    });

module.exports = app;