
class Settings {

    constructor(id, userID, needWeekReport, needMonthReport, categories) {
        this.id = id;
        this.userID = userID;
        this.needWeekReport = needWeekReport;
        this.needMonthReport = needMonthReport;
        this.categories = categories;
    }
};



module.exports = Event;