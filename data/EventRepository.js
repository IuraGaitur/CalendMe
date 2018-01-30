class EventRepository {
    
    name = 'Event'
    
    contructor(dao) {
        this.dao = dao;
    }
    
    add(event) {
        this.dao.write(() => {
            this.dao.create(name, event);
        });
        return;
    }

    getAll() {
        return this.dao.objects(name);
    }

    filter(color, tag, start, end) {
        return this.dao.objects(name).filter("tag LIKE '*" + color +"?'");
    }

    
}

module.exports = EventRepository;