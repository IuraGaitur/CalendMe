const express = require('express');
const router = express.Router();
const calendarClient = require('./../models/CalendarClient.js')

/* GET home page. */
router.get('/info', function(req, res, next) {
    return calendarClient.listEvents(this.authClient).then(function(events) {
        var size = events.length;
      res.json({"status": "Elements size:" + size}); 
    }).catch(function(err){
      res.json({"status": err}); 
    });
});

router.get('/', function(req, res) {
    // Authorize a client with the loaded credentials, then call the
    res.render('index', {'title': "Express"})
    
});


module.exports = router;
