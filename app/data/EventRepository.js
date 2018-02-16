const loki = require('lokijs');
const db = new loki('database.json');
const eventCollection = db.addCollection('events');
const eventModel = require('./../models/Event.js');

class EventRepository {
    
    constructor() {}
    
    add(event) {
        eventCollection.insert(event);
    }

    addAll(events, userID) {
        console.log('User id=' + userID);
        let formatedEvents = new eventModel().mapToEvents(events, userID);
        formatedEvents = JSON.stringify(formatedEvents);
        formatedEvents = JSON.parse(formatedEvents);
        //console.log(formatedEvents);
        eventCollection.insert(formatedEvents);
    }

    getAll(startDate, endDate, startWith, colors, categories, userID) {
        
        let numberOfConditions = 0;
        let conditions = [];
        let result = [];

        conditions.push({'userID': { '$eq' : userID }});

        if(startDate && endDate) {
            conditions.push({'startDate' : { '$between': [startDate, endDate] }});
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

        console.log(conditions);

        if(numberOfConditions == 0) {
            result = eventCollection.find(conditions[0]);
        }else {
            console.log("Multi conditions");
            result = eventCollection.find({'$and': conditions});
        }
       
        console.log(result.length);
        return result;
    }

    removeByUserID(userID) {
        eventCollection.findAndRemove({userID: userID });
    }
}

module.exports = EventRepository;