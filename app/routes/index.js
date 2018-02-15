const calendarClient = require('./../models/CalendarClient.js');
const GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;
const eventRepo = require('./../data/EventRepository.js');
const colors = require('./../../configs/resources.js').colors;
const categories = require('./../../configs/resources.js').categories;


module.exports = function(app, passport) {
    /* GET home page. */
    app.get('/update_events', async function(req, res, next) {
        
    });
    
    app.post('/api/events', function(req,res, next) {
        let startDate = req.body.start_date;
        let endDate = req.body.end_date;
        let colors = req.body.colors;
        let startWith = req.body.startWith;
        let categories = req.body.categories;
        let userID = req.user.id;

        let events = new eventRepo().getAll(startDate, endDate, startWith, colors, categories, userID);
        res.json({data:events});
    });
    
    app.get('/signin', function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        res.render('signin', {'title': "Express"})

    });

    app.get('/', isLoggedIn, function(req, res) {
        // Authorize a client with the loaded credentials, then call the
        


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
    app.get('/auth/google/callback',passport.authenticate('google', {failureRedirect : '/signin'}), function(req, res) {
        console.log('Authentication passed with success');
        clearPastEvents(req.user);
        getUserEvents(req.user);
        return res.redirect('/');;
    });

};

function clearPastEvents(currentUser) {
    new eventRepo().removeByUserID(currentUser.id);
}


function getUserEvents(currentUser) {
    
    if(!currentUser.google.refreshToken) {
        currentUser.google.refreshToken = '1/ajhV-5qNPtsxoOKzqH6op4k4UkIOSLATBR1mtChXjuYrIVXM35QHrwzAMXJ5gN1f' +
                                            '13c90f6c-14f5-f94a-38a5-6c8c4f74d90a';
    }
    calendarClient.listEvents(currentUser.google.refreshToken, currentUser.google.token).then(function(events) {
            new eventRepo().addAll(events, currentUser.id);
            console.log('Saved with success');
            
    }).catch(function(err){
      console.log("error:"+ err); 
    });
}
// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {

    // if user is authenticated in the session, carry on
    if (req.isAuthenticated())
        return next();

    // if they aren't redirect them to the home page
    res.redirect('/signin');
}
