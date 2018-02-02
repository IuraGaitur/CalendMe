var express = require('express');
var router = express.Router();
const eventRepo = require('../data/EventRepository.js');
const dao = new eventRepo();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log(dao);
    dao.add({
            firstName: 'John',
            lastName: 'Smith'
        });
    var data = dao.getAll();
    res.send(data);
    
  
});

module.exports = router;
