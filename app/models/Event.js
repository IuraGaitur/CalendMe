const resources = require('./../../configs/resources.js')

class Event {

    constructor(id, name, color, startDate, endDate, category, userID) {
        this.id = id;
        this.name = name;
        this.color = color;
        this.startDate = startDate;
        this.endDate = endDate;
        this.category = category;
        this.userID = userID;
    }


    mapToEvents(events, userID) {
    	let items = [];
    	
    	for(let i = 0; i < events.length; i++) {
    		let item = events[i];
    		items.push(new Event(item.id, item.summary, item.colorId, new Date(item.start.dateTime).getTime(), 
    			new Date(item.end.dateTime).getTime(), getCategory(item.summary), userID));
    	}
    	
    	return items;

    }
};

function getCategory(name) {
	for(let i = 0; i < resources.categories.length; i++) {
		if(name.includes(resources.categories[i].shortName)) {
			return resources.categories[i].shortName;
		}
	}

	return 'No category';


}

function guid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

module.exports = Event;