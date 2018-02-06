const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const LocalStrategy    = require('passport-local').Strategy;
const User = require('./../app/models/User.js');
const UserRepository = require('./../app/data/UserRepository.js');
const configAuth = require('./google_auth');

module.exports = function(passport) {

    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });

    // used to deserialize the user
    passport.deserializeUser(function(id, done) {
        return new UserRepository().getById(id);
    });

    // code for login (use('local-login', new LocalStategy))
    // code for signup (use('local-signup', new LocalStategy))
    // code for facebook (use('facebook', new FacebookStrategy))
    // code for twitter (use('twitter', new TwitterStrategy))

    // =========================================================================
    // GOOGLE ==================================================================
    // =========================================================================
    passport.use(new GoogleStrategy({

        clientID        : configAuth.googleAuth.clientID,
        clientSecret    : configAuth.googleAuth.clientSecret,
        callbackURL     : configAuth.googleAuth.callbackURL,

    },
    function(token, refreshToken, profile, done) {

        // make the code asynchronous
        // User.findOne won't fire until we have all our data back from Google
        process.nextTick(function() {

            // try to find the user based on their google id
            new UserRepository().findByGoogleID(profile.id) {
                if (err)
                    return done(err);

                if (user) {
                    // if a user is found, log them in
                    return done(null, {user});
                } else {
                    // if the user isnt in our database, create a new user
                    var newUser = new User();

                    // set all of the relevant information
                    newUser.google.id    = profile.id;
                    newUser.google.token = token;
                    newUser.google.name  = profile.displayName;
                    newUser.google.email = profile.emails[0].value; // pull the first email
                    console.log(newUser);
                    // save the user
                    new UserRepository().add(newUser);
                    return done(null, newUser);
                }
            });
        });

    }));

};