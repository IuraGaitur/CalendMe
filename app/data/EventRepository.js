var loki = require('lokijs');
var db = new loki('database.json');
var eventCollection = db.addCollection('events');

class EventRepository {
    
    constructor() {}
    
    add(event) {
        eventCollection.insert(event);
    }

    getAll() {
        return eventCollection.find();
    }

    filter(color, tag, start, end) {
        return eventCollection.find({'tag': 'color' })
    }

    
}

module.exports = EventRepository;