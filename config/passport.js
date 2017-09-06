var passport            = require("passport-local").Strategy,
    guid                = require("../guid.js"),
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




module.exports = function (passport) {
    // pg.connect(dbURL, function (err, client) {
    //     if (err) throw err;
    const { Pool, Client } = require('pg');

    const client = new Client({
        user: creds.soap.psql.userName,
        password: creds.soap.psql.password,
        database: 'soap',
        port: 5432
    });
    client.connect();
    
        passport.serializeUser(function (user, done) {
            done(null, user.id);
        });
        // used to deserialize the user
        passport.deserializeUser(function (id, done) {
            client.query(psql('users').where("id", id).toString(), (err, res)=>{
                if(err){
                    done(null, false);
                } else {
                    done(null,res.rows[0]);
                }
            });
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
                        client.query(psql('users').where("email", profile.emails[0].value).toString(), (err, res)=> {
                            if(err){
                                done(null, false);
                            } else {
                                if(res.rows.length){
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
                                            done(null, false);
                                        } else {
                                            done(null, newUser);
                                        }
                                    });
                                }
                            }
                        });
                    } else return done(null, false)
                });
            }));
};
