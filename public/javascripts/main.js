
let selectedColors = [];
let selectedCategories = [];

//Date setup
let startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
let endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
let startDateFrom = new Date(startOfMonth).getTime();
let endDateTo = new Date(endOfMonth).getTime();

//Graphs data
let chartsData = [];

let colors = [
            {id:3, name: 'Tomato', color: [213, 0, 0]},
            {id:4, name: 'Tangerine', color: [ 244, 81, 30]},
            {id:5, name: 'Banana', color: [ 246, 191, 38]},
            {id:6, name: 'Basil', color: [ 11, 128, 67]},
            {id:7, name: 'Sage', color: [ 251, 182, 121]},
            {id:8, name: 'Peacock', color: [ 3, 155, 129]},
            {id:9, name: 'Blueberry', color: [ 63, 81, 181]},
            {id:10, name: 'Lavender', color: [ 121, 134, 203]},
            {id:11, name: 'Grape', color: [ 142, 36, 170]},
            {id:12, name: 'Flamingo', color: [ 230, 124, 115]},
            {id:13, name: 'Graphite', color: [ 97, 97, 97]},
            {id:14, name: 'Default Blue', color: [ 66, 133, 244]}
        ];
        
let categories = [
            {id:1, name: "Work", short_name: ["WOV", "WV"], color: 'rgba(213, 0, 0, 0.5)'},
            {id:2, name: "Health", short_name: ["HEV", "HV"], color: 'rgba(244, 81, 30, 0.5)'},
            {id:3, name: "Discipline", short_name: ["DIV", "DV"], color: 'rgba(246, 191, 38, 0.5)'},
            {id:4, name: "Food", short_name: ["FOV","FV"], color: 'rgba(11, 128, 67, 0.5)'},
            {id:5, name: "Procastination", short_name: ["PROC", "Proc"], color: 'rgba(251, 182, 121, 0.5)'},
            {id:6, name: "Sleep", short_name: ["SLV", "SV"], color: 'rgba(3, 155, 129, 0.5)'},
            {id:7, name: "Beauty", short_name: ["BEV", "BV"], color: 'rgba(63, 81, 181, 0.5)'},
            {id:8, name: "Event", short_name: ["EVV", "EV"], color: 'rgba(121, 134, 203, 0.5)'},
            {id:9, name: "Programming", short_name: ["PRV", "PV"], color: 'rgba(142, 36, 170, 0.5)'},
            {id:10, name: "Resources", short_name: ["REV", "RV"], color: 'rgba(230, 124, 115, 0.5)'},
            {id:11, name: "Information", short_name: ["INV", "IV"], color: 'rgba(97, 97, 97, 0.5)'},
            {id:12, name: "Sport", short_name: ["SPV", "SV"], color: 'rgba(66, 133, 244, 0.5)'}
        ];

/**
    Update charts
**/
function updateGraphs(events) {
    chartsData = getDistinctEvents(events);
    updatePieChart(chartsData.pieData);
    refreshBarChartData(chartsData.barData);
    refreshStackBarChartData(chartsData.groupBarData);
    
}

/**
    Update for pie chart
**/
function updatePieChart(events) {
    window.myPie.data.labels = events.map(item => item.label);
    window.myPie.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myPie.data.datasets[0].label = "Data for period __:__";
    window.myPie.data.datasets[0].backgroundColor = events.map(item => item.color); 
    window.myPie.update();
}

function refreshBarChartData(events, dateType) {

    if(dateType == 'day') {
        updateBarChart(events.day);
    } else if(dateType == 'year') {
        updateBarChart(events.year);
    } else {
        updateBarChart(events.month);
    }
}

function refreshStackBarChartData(events, dateType) {
     if(dateType == 'day') {
        updateGroupBarChart(events.day);
    } else if(dateType == 'year') {
        updateGroupBarChart(events.year);
    } else {
        updateGroupBarChart(events.month);
    }
}

/**
    Update for bar chart
**/
function updateBarChart(events) {
    window.myBar.data.labels = events.map(item => item.label);
    window.myBar.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myBar.data.datasets[0].label = "Data for period " 
                    +  moment(new Date(startDateFrom)).format('YYYY-MM-DD') + ':' 
                    +  moment(new Date(endDateTo)).format('YYYY-MM-DD');
    window.myBar.update();
}

/**
    Update for group chart
**/
function updateGroupBarChart(data) {
    window.myGroup.data = data;
    window.myGroup.update();
}


/**
    Define events aggregation for all charts
**/
function getDistinctEvents(events) {
    let pieData = [];
    let barData = {day:[], month:[], year:[]};
    let groupData = {day:[], month:[], year: []};
    let groupBarData = {day:[], month:[], year: []};

    //Events
    for(let i = 0; i < events.length; i++) {
        getPieInfo(events[i], pieData);
        getBarInfo(events[i], barData);
        getGroupBarInfo(events[i], groupBarData);
    }

    groupData.day = aggregateBarInfo(groupBarData.day);
    groupData.month = aggregateBarInfo(groupBarData.month);
    groupData.year = aggregateBarInfo(groupBarData.year);
    
    return {pieData: pieData, barData: barData, groupBarData: groupData};
}

/**
    Define logic for aggregation pie chart info
**/
function getPieInfo(event, pieData) {
    for(let j = 0; j < categories.length; j++) {
        //Categories shortName
        for(let k = 0; k < categories[j].short_name.length; k++) {
            if(event.name.includes(categories[j].short_name[k])) {
                let time = event.endDate - event.startDate;
                
                if(containsKeyItem(pieData, categories[j].name)) {
                    let key = getItemPosWithKey(pieData, categories[j].name) 
                    pieData[key].value = pieData[key].value + time; 
                }else {
                    pieData.push({label: categories[j].name, value: time, color: categories[j].color})  
                }     
            }
        }
    }
}


/**
    Define logic for aggregation bar chart info
**/
function getBarInfo(event, barData) {
    
    let labelDay = formatDate(new Date(event.startDate), 'day');
    let labelMonth = formatDate(new Date(event.startDate), 'month');
    let labelYear = formatDate(new Date(event.startDate), 'year');

    let time = event.endDate - event.startDate;
    if(time > 24 * 60 * 60 * 1000) return;

    //check for day
    if(containsKeyItem(barData.day, labelDay)) {
        let key = getItemPosWithKey(barData.day, labelDay) 
        barData.day[key].value = barData.day[key].value + time; 
    }else {
        barData.day.push({label: labelDay, value: time})  
    }

    //check for month
    if(containsKeyItem(barData.month, labelMonth)) {
        let key = getItemPosWithKey(barData.month, labelMonth) 
        barData.month[key].value = barData.month[key].value + time; 
    }else {
        barData.month.push({label: labelMonth, value: time})  
    }  

    //check for year
    if(containsKeyItem(barData.year, labelYear)) {
        let key = getItemPosWithKey(barData.year, labelYear) 
        barData.year[key].value = barData.year[key].value + time; 
    }else {
        barData.year.push({label: labelYear, value: time})  
    }    
}


/**
    Define logic for aggregation group chart info
**/
function getGroupBarInfo(event, groupData) {

    let labelDay = formatDate(new Date(event.startDate));
    let labelMonth = formatDate(new Date(event.startDate), 'month');
    let labelYear = formatDate(new Date(event.startDate), 'year');

    let time = event.endDate - event.startDate;

    if(time > 24 * 60 * 60 * 1000) return;
    
    //check for day
    if(containsKeyItem(groupData.day, labelDay)) {
        let key = getItemPosWithKey(groupData.day, labelDay) 
        groupData.day[key].data.push({name: event.name, color: event.color, time: time}); 
    }else {
        groupData.day.push({label: labelDay, data: [{name: event.name, color: event.color, time: time}]});  
    }

    //check for month
    if(containsKeyItem(groupData.month, labelMonth)) {
        let key = getItemPosWithKey(groupData.month, labelMonth) 
        groupData.month[key].data.push({name: event.name, color: event.color, time: time}); 
    }else {
        groupData.month.push({label: labelMonth, data: [{name: event.name, color: event.color, time: time}]});  
    }

    //check for year
    if(containsKeyItem(groupData.year, labelYear)) {
        let key = getItemPosWithKey(groupData.year, labelYear) 
        groupData.year[key].data.push({name: event.name, color: event.color, time: time}); 
    }else {
        groupData.year.push({label: labelYear, data: [{name: event.name, color: event.color, time: time}]});  
    }
}

/**
    Define logic for aggregation bar chart info
**/
function aggregateBarInfo(events) {

    let days = events.map(event => event.label);
    let result = {labels: days, datasets:[]};

    for(let i = 0; i < categories.length; i++) {
        let dataset = aggregateCategory(events, categories[i], days);
        result.datasets.push(dataset);
    }

    return result;
}

/**
    Define logic for aggregation of complex graph
**/
function aggregateCategory(events, category, days) {
    
    let datasetWork = {label: category.name,
        backgroundColor: category.color,
        stack: 'Stack',
        data: []
     };


    for(let i = 0; i < days.length; i++) {
        let day = events.filter(item => item.label == days[i])[0];
        let items = day.data.filter(item => manyIncludes(category.short_name, item.name));
        
        let totalTime = 0;
        for(let j = 0; j < items.length; j++) {
            totalTime += items[j].time;
        }

        datasetWork.data.push(milisecondsToTime(totalTime));
    }

    return datasetWork;
}

/**
    Define update action for group chart
**/
function updateAgregatorChart() {
    var value = window.myPie.data.datasets[0].data[0];
    window.myPie.data.datasets[0].data[0] = value + 5;
    window.myPie.update();
}

/**
    Event callback for Submit button
**/
$('#submit').on('click', function(e) {
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});

//Call update events
updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);


/**
    Button for sorting click
**/
$('#day_bar_chart').on('click', function(e) {
    refreshBarChartData(chartsData.barData, 'day');    
});
$('#month_bar_chart').on('click', function(e) {
    refreshBarChartData(chartsData.barData, 'month');    
});
$('#year_bar_chart').on('click', function(e) {
    refreshBarChartData(chartsData.barData, 'year');    
});


$('#day_stack_chart').on('click', function(e) {
    refreshStackBarChartData(chartsData.groupBarData, 'day');     
});
$('#month_stack_chart').on('click', function(e) {
    refreshStackBarChartData(chartsData.groupBarData, 'month'); 
});
$('#year_stack_chart').on('click', function(e) {
    refreshStackBarChartData(chartsData.groupBarData, 'year'); 
});

/**
    Define action callback for changing date
**/
$('input[name="daterange"]').daterangepicker(
    {
        locale: {
          format: 'YYYY-MM-DD'
        },
        startDate: startOfMonth,
        endDate: endOfMonth
    }, 
    function(start, end, label) {
        startDateFrom = new Date(start).getTime();
        endDateTo = new Date(end).getTime();
});


/**
    Define action callback for selecting a category
**/
$('#categorySelect').on('changed.bs.select', function (e, index, active) {
    if(active) {
        selectedCategories.push(categories[index].id);
    }else {
        selectedCategories.splice(selectedCategories.indexOf(categories[index].id), 1);
    }
});

/**
    Define action callback for selecting a color
**/
$('#colorSelect').on('changed.bs.select', function (e, index, active) {
     if(active) {
        selectedCategories.push(categories[index].id);
    }else {
        selectedCategories.splice(selectedCategories.indexOf(categories[index].id), 1);
    }
});

/**
    Define ajax call for getting events
**/
function updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors) {
    let searchString = $('#search_event').val();
    $.ajax({
      type: 'POST',
      url: '/api/events',
      data: { 
            start_date: startDateFrom, 
            end_date: endDateTo, 
            categories: selectedCategories,
            colors: selectedColors,
            startWith: searchString
      },
      success: function(result) {
        updateGraphs(result.data);
      }
    });
}

/**
    Util function for array 
**/
function manyIncludes(items, name) {

    let result = false;
    for(let i = 0; i < items.length; i++) {
        if(name.includes(items[i])) {
            result = true;
        }
    }
    return result;
}

    
function getItemPosWithKey(array, key) {
    var pos = -1;
    for(var i = 0; i < array.length; i++) {
        if (array[i].label == key) {
            pos = i;
            break;
        }
    }
    
    return pos;
}

function containsKeyItem(array, key) {
    var found = false;
    for(var i = 0; i < array.length; i++) {
        if (array[i].label == key) {
            found = true;
            break;
        }
    }
    
    return found;
}


/**
    Util functions for time
**/
function formatDate(date, type) {
  var monthNames = [
    "January", "February", "March",
    "April", "May", "June", "July",
    "August", "September", "October",
    "November", "December"
  ];

  var day = date.getDate();
  var monthIndex = date.getMonth();
  var year = date.getFullYear();
  
  if(type == 'year') {
    output = year;
  }else if(type == 'month') {
    output = monthNames[monthIndex] + ' ' + year;
  }else {
      output = day + ' ' + monthNames[monthIndex] + ' ' + year;
  }
    
  return output;
 
}

function milisecondsToTime(milisecs)
{
    let secs = milisecs / 1000;
    secs = Math.round(secs);
    let hours = Math.floor(secs / (60 * 60));
    return hours;
}
        