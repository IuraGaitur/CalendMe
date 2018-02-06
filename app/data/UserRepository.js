var loki = require('lokijs');
var db = new loki('database.json');
var userCollection = db.addCollection('users');

class UserRepository {
    
    constructor() {}
    
    add(user) {
        userCollection.insert(user);
    }

    getAll() {
        return userCollection.find();
    }
    
    getById(id) {
        return userCollection.findOne({'id': id});
    }
    
    delete(id) {
        userCollection.findAndRemove({id: v.id});
    }
    
    deleteAll() {
         userCollection.deleteAll();
    }
}

module.exports = UserRepository;