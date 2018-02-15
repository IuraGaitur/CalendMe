
let selectedColors = [];
let selectedCategories = [];

//Date setup
let startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
let endOfMonth   = moment().endOf('month').format('YYYY-MM-DD');
let startDateFrom = new Date(startOfMonth).getTime();
let endDateTo = new Date(endOfMonth).getTime();

//Date time type
let dateTypePieChart = 'month';
let dateTypePieChart = 'month';
let dateTypePieChart = 'month';

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
            {id:2, name: "Health", short_name: ["HEV", "HV"], color: 'rgba( 244, 81, 30, 0.5)'},
            {id:3, name: "Discipline", short_name: ["DIV", "DV"], color: 'rgba( 246, 191, 38, 0.5)'},
            {id:4, name: "Food", short_name: ["FOV","FV"], color: 'rgba( 11, 128, 67, 0.5)'},
            {id:5, name: "Procastination", short_name: ["PROC", "Proc"], color: 'rgba( 251, 182, 121, 0.5)'},
            {id:6, name: "Sleep", short_name: ["SLV", "SV"], color: 'rgba( 3, 155, 129, 0.5)'},
            {id:7, name: "Beauty", short_name: ["BEV", "BV"], color: 'rgba( 63, 81, 181, 0.5)'},
            {id:8, name: "Event", short_name: ["EVV", "EV"], color: 'rgba( 121, 134, 203, 0.5)'},
            {id:9, name: "Programming", short_name: ["PRV", "PV"], color: 'rgba( 142, 36, 170, 0.5)'},
            {id:10, name: "Resources", short_name: ["REV", "RV"], color: 'rgba( 230, 124, 115, 0.5)'},
            {id:11, name: "Information", short_name: ["INV", "IV"], color: 'rgba( 97, 97, 97, 0.5)'},
            {id:12, name: "Sport", short_name: ["SPV", "SV"], color: 'rgba(66, 133, 244, 0.5)'}
        ];


/**
    Dump data for event testing
**/
function getDumpEvents() {
    return [{startDate: new Date('2018-02-02T12:00'), endDate: new Date('2018-02-02T14:00'), name: '[WV]Doing work', color: 'rgba(255, 99, 132, 0.5)'},
          {startDate: new Date('2018-02-03T12:00'), endDate: new Date('2018-02-03T18:00'), name: '[EV]Doing work', color: 'rgba(54, 162, 235, 0.5)'},
          {startDate: new Date('2018-02-04T12:00'), endDate: new Date('2018-02-04T15:00'), name: '[SV]Doing work', color: 'rgba(255, 206, 86, 0.5)'},
          {startDate: new Date('2018-02-05T12:00'), endDate: new Date('2018-02-05T14:00'), name: '[DV]Doing work', color: 'rgba(75, 192, 192, 0.5)'},
          {startDate: new Date('2018-02-06T12:00'), endDate: new Date('2018-02-06T14:00'), name: '[WV]Doing work', color: 'rgba(153, 102, 255, 0.5)'},
         ];
}


/**
    Update charts
**/
function updateGraphs(events) {
    let chartsData = getDistinctEvents(events);
    updatePieChart(chartsData.pieData);
    updateBarChart(chartsData.barData);
    updateGroupBarChart(chartsData.groupBarData);
    
}

/**
    Update for pie chart
**/
function updatePieChart(events) {
    window.myPie.data.labels = events.map(item => item.label);
    window.myPie.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myPie.data.datasets[0].label = "Data for period __:__";
    window.myPie.data.backgroundColor = events.map(item => item.color); 
    window.myPie.update();
}

/**
    Update for bar chart
**/
function updateBarChart(events) {
    window.myBar.data.labels = events.map(item => item.label);
    window.myBar.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myBar.data.datasets[0].label = "Data for period __:__ on labels: ....";
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
    let barData = [];
    let groupBarData = [];
    //Events
    for(let i = 0; i < events.length; i++) {
        getPieInfo(events[i], pieData);
        getBarInfo(events[i], barData);
        getGroupBarInfo(events[i], groupBarData);
    }

    groupData = aggregateBarInfo(groupBarData);
    
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
                    pieData.push({label: categories[j].name, value: time, color: event.color})  
                }     
            }
        }
    }
}

/**
    Define logic for aggregation bar chart info
**/
function getBarInfo(event, barData) {
    
    let label = formatDate(new Date(event.startDate));
    let time = event.endDate - event.startDate;
    
    if(containsKeyItem(barData, label)) {
        let key = getItemPosWithKey(barData, label) 
        barData[key].value = barData[key].value + time; 
    }else {
        barData.push({label: label, value: time})  
    }  
}

/**
    Define logic for aggregation group chart info
**/
function getGroupBarInfo(event, groupData) {

    let label = formatDate(new Date(event.startDate));
    let time = event.endDate - event.startDate;
    
    if(containsKeyItem(groupData, label)) {
        let key = getItemPosWithKey(groupData, label) 
        groupData[key].data.push({name: event.name, color: event.color, time: time}); 
    }else {
        groupData.push({label: label, data: [{name: event.name, color: event.color, time: time}]});  
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
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});


/**
    Button for sorting click
**/
$('#day_bar_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#month_bar_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#year_bar_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});


$('#day_pie_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#month_pie_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#year_pie_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});


$('#day_stack_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#month_stack_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});
$('#year_stack_chart').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors);    
});


month_bar_chart


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
  var output = monthNames[monthIndex] + ' ' + year
  if(type !== 'month') {
      output = day + ' ' + output;
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
        