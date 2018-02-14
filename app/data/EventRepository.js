const loki = require('lokijs');
const db = new loki('database.json');
const eventCollection = db.addCollection('events');
const eventModel = require('./../models/Event.js');

class EventRepository {
    
    constructor() {}
    
    add(event) {
        eventCollection.insert(event);
    }

    addAll(events) {
        let formatedEvents = new eventModel().mapToEvents(events);
        eventCollection.insert(formatedEvents);
    }

    getAll(startDate, endDate, startWith, colors, categories, userID) {
        
        let numberOfConditions = 0;
        let conditions = [];
        let result = [];

        conditions.push({userID: { '$eq' : userID }})

        if(startDate && endDate) {
            conditions.push({startDate : { '$between': [startDate, endDate] }});
            numberOfConditions++;
        }

        if(startWith) {
            conditions.push({name : { '$regex': startWith}});
            numberOfConditions++;
        }

        if(categories) {
            conditions.push({category : { '$in' : categories}});
            numberOfConditions++;
        }

        if(numberOfConditions == 1) {
            result = eventCollection.find(conditions[0]);
        }else {
            result = eventCollection.find('$and': conditions);
        }
       

        return result;
    }
}

module.exports = EventRepository;