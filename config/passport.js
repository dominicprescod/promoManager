var passport            = require("passport"),
    guid                = require("../guid.js"),
    disconnect          = require("../disconnect.js"),
    creds               = require(process.env.HOME+"/.creds/node/credentials.js"),
    dbURL               = process.env.DATABASE_URL || 'postgres://localhost:5432/soap',
    searchPath          = process.env.SEARCH_PATH || 'soap/public',
    pg                  = require('pg'),
    psql                = require('knex')({
                            client: 'pg',
                            connection: dbURL,
                            searchPath: searchPath
                        }),
    GoogleStrategy      = require("passport-google-oauth").OAuth2Strategy;




module.exports = (passport) => {
    // pg.connect(dbURL, function (err, client) {
    //     if (err) throw err;
    const { Pool, Client } = require('pg');

    const client = new Client({
        user: creds.soap.psql.userName,
        password: creds.soap.psql.password,
        database: 'soap',
        port: 5432
    });
    
    
        passport.serializeUser(function (user, done) {
            console.log("inside serializeUser");
            // console.log(user);
            done(null, user.id);
        });
        // used to deserialize the user
        passport.deserializeUser(function (id, done) {
            console.log("inside deserializedUser");
            // client.connect()
            // .then(()=> {
                client.query(psql('users').where("id", id).toString(), (err, res) => {
                    if (err) {
                        console.log("problem deserialize query")
                        // disconnect(client);
                        done(null, false);
                    } else {
                        console.log("success with deserialize query")
                        // disconnect(client);
                        done(null, res.rows[0]);
                    }
                });
            // })
            // .catch(e => console.log("deserializeUser prob connecting\n "+e.stack)); 
        });

        // =========================================================================
        // GOOGLE ==================================================================
        // =========================================================================
        passport.use('google', new GoogleStrategy({
            clientID: creds.soap.google.clientID,
            clientSecret: creds.soap.google.clientSecret,
            callbackURL: creds.soap.google.callbackURL,
        },
            function (token, refreshToken, profile, done) {
                process.nextTick(function () {
                    // Restricting access to IDT Employees
                    var valid = "idt.net";
                    var a = profile.emails[0].value;
                    var b = [];
                    for (var i = 7; i >= 1; i--) b.push(a[a.length - i]);
                    b = b.join('').replace(/,/g, '');
                    var newUser = {};
                    if (b === valid) {
                        client.connect();
                        client.query(psql('users').where("email", profile.emails[0].value).toString(), (err, res)=> {
                            if(err){
                                disconnect(client);
                                done(null, false);
                            } else {
                                if(res.rows.length){
                                    disconnect(client);
                                    // found the user sending the first element in the row results.
                                    done(null, res.rows[0]);
                                } else {
                                    // did not find the user...creating a new user.
                                    newUser['id'] = guid();
                                    newUser['email'] = profile.emails[0].value;
                                    newUser['first_name'] = profile.name.givenName;
                                    newUser['last_name'] = profile.name.familyName;
                                    newUser['active'] = false;
                                    // Insert the new user to the DB
                                    client.query(psql.insert(newUser).into('users').toString(), (nErr, nRes)=> {
                                        if(nErr){
                                            disconnect(client);
                                            done(null, false);
                                        } else {
                                            disconnect(client);
                                            done(null, newUser);
                                        }
                                    });
                                }
                            }
                        });
                    } else {
                        console.log("not valid email: \n"+b)
                        disconnect(client);
                        return done(null, false);
                    }
                });
            }));
};
