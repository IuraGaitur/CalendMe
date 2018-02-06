const calendarClient = require('./../models/CalendarClient.js');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/info', function(req, res, next) {
        return calendarClient.listEvents(this.authClient).then(function(events) {
            var size = events.length;
          res.json({"status": "Elements size:" + size}); 
        }).catch(function(err){
          res.json({"status": err}); 
        });
    });
    
    app.get('/signin', function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        res.render('signin', {'title': "Express"})

    });

    app.get('/', isLoggedIn, function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        res.render('index', {'title': "Express"})

    });

    // route for showing the profile page
    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user // get the user out of session and pass to template
        });
    });

    // route for logging out
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email'] }));

    // the callback after google has authenticated the user
    app.get('/auth/google/callback',passport.authenticate('google', {successRedirect : '/',failureRedirect : '/signin'}));





};
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/signin');
}
