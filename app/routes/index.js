const calendarClient = require('./../models/CalendarClient.js');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const eventRepo = require('./../data/EventRepository.js');

module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/update_events', async function(req, res, next) {
            let currentUser = req.user;
            await calendarClient.listEvents(currentUser.google.refreshToken, currentUser.google.token, currentUser.id).then(function(events) {
            eventRepo.save(events);
            res.json({"status": "Saved " + events.length + " elements"}); 
        }).catch(function(err){
          res.json({"error": err}); 
        });
    });
    
    app.get('/get_events', function(req,res, next) {
        
    });
    
    app.get('/signin', function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        res.render('signin', {'title': "Express"})

    });

    app.get('/', isLoggedIn, function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        let colors = [
            {id:3, name: 'Tomato', color: [213, 0, 0]},
            {id:4, name: 'Tangerine', color: [ 244, 81, 30]},
            {id:5, name: 'Banana', color: [ 246, 191, 38]},
            {id:6, name: 'Basil', color: [ 11, 128, 67]},
            {id:7, name: 'Sage', color: [ 251, 182, 121]},
            {id:8, name: 'Peacock', color: [ 3, 155, 129]},
            {id:9, name: 'Blueberry', color: [ 63, 81, 181]},
            {id:10, name: 'Lavender', color: [ 121, 134, 203]},
            {id:11, name: 'Grape', color: [ 142, 36, 170]},
            {id:12, name: 'Flamingo', color: [ 230, 124, 115]},
            {id:13, name: 'Graphite', color: [ 97, 97, 97]},
            {id:14, name: 'Default Blue', color: [ 66, 133, 244]}
        ];
        
        let categories = [
            {id:1, name: "Work", short_name: "WOV"},
            {id:1, name: "Health", short_name: "HEV"},
            {id:1, name: "Discipline", short_name: "DIV"},
            {id:1, name: "Food", short_name: "FOV"},
            {id:1, name: "Procastination", short_name: "PROC"},
            {id:1, name: "Sleep", short_name: "SLV"},
            {id:1, name: "Beauty", short_name: "BEV"},
            {id:1, name: "Event", short_name: "EVV"},
            {id:1, name: "Programming", short_name: "PRV"},
            {id:1, name: "Resources", short_name: "REV"},
            {id:1, name: "Information", short_name: "INV"},
            {id:1, name: "Sport", short_name: "SPV"},
            {id:1, name: "Resources", short_name: "REV"}
        ];
        
        res.render('index', {'title': "Express", 'colors': colors, 'categories': categories})

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


    app.get('/auth/google', passport.authenticate('google', { scope : ['profile', 'email', 'https://www.googleapis.com/auth/calendar'],
                                                              accessType: 'offline', approvalPrompt: 'force'}));

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
