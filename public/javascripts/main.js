
let selectedColors = [];
let selectedCategories = [];
let startDateFrom = new Date();
let endDateTo = new Date();
let searchString = ''; 


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
            {id:1, name: "Work", short_name: ["WOV", "WV"]},
            {id:1, name: "Health", short_name: ["HEV", "HV"]},
            {id:1, name: "Discipline", short_name: ["DIV", "DV"]},
            {id:1, name: "Food", short_name: ["FOV","FV"]},
            {id:1, name: "Procastination", short_name: ["PROC", "Proc"]},
            {id:1, name: "Sleep", short_name: ["SLV", "SV"]},
            {id:1, name: "Beauty", short_name: ["BEV", "BV"]},
            {id:1, name: "Event", short_name: ["EVV", "EV"]},
            {id:1, name: "Programming", short_name: ["PRV", "PV"]},
            {id:1, name: "Resources", short_name: ["REV", "RV"]},
            {id:1, name: "Information", short_name: ["INV", "IV"]},
            {id:1, name: "Sport", short_name: ["SPV", "SV"]}
        ];


$('#submit').on('click', function(e) {
    console.log("Click" + startDateFrom + " " + selectedCategories);
    //updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors, searchString);
    let events = getDumpEvents();
    updateGraphs(events);
    
});


function getDumpEvents() {
    return [{startDate: new Date('2018-02-02T12:00'), endDate: new Date('2018-02-02T14:00'), name: '[WV]Doing work', color: 'rgba(255, 99, 132, 0.2)'},
          {startDate: new Date('2018-02-03T12:00'), endDate: new Date('2018-02-03T18:00'), name: '[EV]Doing work', color: 'rgba(54, 162, 235, 0.2)'},
          {startDate: new Date('2018-02-04T12:00'), endDate: new Date('2018-02-04T14:00'), name: '[SV]Doing work', color: 'rgba(255, 206, 86, 0.2)'},
          {startDate: new Date('2018-02-05T12:00'), endDate: new Date('2018-02-05T14:00'), name: '[DV]Doing work', color: 'rgba(75, 192, 192, 0.2)'},
          {startDate: new Date('2018-02-06T12:00'), endDate: new Date('2018-02-06T14:00'), name: '[WV]Doing work', color: 'rgba(153, 102, 255, 0.2)'},
         ];
}

function updateGraphs(events) {
    let chartsData = getDistinctEvents(events);
    console.log(chartsData);
    updatePieChart(chartsData.pieData);
    //updateBarChart(chartsData.pieData);
    //updateGroupBarChart(chartsData.pieData);
    
}

function updatePieChart(events) {
    window.myPie.data.labels = events.map(item => item.label);
    window.myPie.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myPie.data.datasets[0].backgroundColor = events.map(item => item.color);
    window.myPie.data.datasets[0].label = "Data for period __:__";
    window.myPie.update();
}

function updateBarChart() {
    window.myPie.data.labels = events.map(item => item.label);
    window.myPie.data.datasets[0].data = events.map(item => item.value);
    window.myPie.data.datasets[0].backgroundColor = events.map(item => item.color);
    window.myPie.data.datasets[0].label = "Data for period __:__";
    window.myPie.update();
}

function updateGroupBarChart() {
    window.myPie.data.labels = events.map(item => item.label);
    window.myPie.data.datasets[0].data = events.map(item => milisecondsToTime(item.value));
    window.myPie.data.datasets[0].backgroundColor = events.map(item => item.color);
    window.myPie.data.datasets[0].label = "Data for period __:__";
    window.myPie.update();
}


function getDistinctEvents(events) {
    let pieData = [];
    let barData = [];
    let groupBarData = {};
    //Events
    for(let i = 0; i < events.length; i++) {
        //info for pie chart
        getPieInfo(events[i], pieData);
        
        //info for bar chart
        //getBarInfo(events[i], barData);
        
        //get info for group chart
        //getGroupBarInfo(events[i], )
        
        
    }
    
    return {pieData: pieData, barData: barData, groupBarData: groupBarData};
}

function getPieInfo(event, pieData) {
    for(let j = 0; j < categories.length; j++) {
        //Categories shortName
        for(let k = 0; k < categories[j].short_name.length; k++) {
            if(event.name.includes(categories[j].short_name[k])) {
                let time = event.endDate - event.startDate;
                
                if(containsKeyItem(pieData, event.name)) {
                    let key = getItemPosWithKey(pieData, event.name) 
                    pieData[key].value = pieData[key].value + time; 
                }else {
                    pieData.push({label: categories[j].name, value: time, color: event.color})  
                }     
            }
        }
    }
}

// function getBarInfo(event, barData) {
    
//     let label = formatDate(event.startDate);
    
//     if(containsKeyItem(barData, label)) {
//         let key = getItemPosWithKey(barData, label) 
//         barData[key].value = barData[key].value + time; 
//     }else {
//         barData.push({label: label, value: time})  
//     }  
// }

// function getGroupBarInfo(event, groupData) {
    
    
    
//     let label = formatDate(event.startDate, 'month');
//     groupData.labels = {}
    
//     if(containsKeyItem(barData, label)) {
//         let key = getItemPosWithKey(barData, label) 
//         barData[key].value = barData[key].value + time; 
//     }else {
//         barData.push({label: label, value: time})  
//     }
// }

//labels: ["January", "February", "March", "April", "May", "June", "July"],
//            datasets: [{
//                label: 'Dataset 1',
//                backgroundColor: 'rgba(255, 99, 132, 0.2)',
//                stack: 'Stack 0',
//                data: [
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor()
//                ]
//            }, {
//                label: 'Dataset 2',
//                backgroundColor: 'rgba(153, 102, 255, 0.2)',
//                stack: 'Stack 0',
//                data: [
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor()
//                ]
//            }, {
//                label: 'Dataset 3',
//                backgroundColor: 'rgba(13, 102, 255, 0.2)',
//                stack: 'Stack 1',
//                data: [
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor(),
//                    randomScalingFactor()
//                ]
//            }]




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

function updateBarChart() {
    var value = window.myPie.data.datasets[0].data[0];
    window.myPie.data.datasets[0].data[0] = value + 5;
    window.myPie.update();
}

function updateAgregatorChart() {
    var value = window.myPie.data.datasets[0].data[0];
    window.myPie.data.datasets[0].data[0] = value + 5;
    window.myPie.update();
}

$('input[name="daterange"]').daterangepicker(
    {
        locale: {
          format: 'YYYY-MM-DD'
        },
        startDate: '2013-01-01',
        endDate: '2013-12-31'
    }, 
    function(start, end, label) {
        startDateFrom = start;
        endDateTo = end;
        alert("A new date range was chosen: " + start.format('YYYY-MM-DD') + ' to ' + end.format('YYYY-MM-DD'));
});
$('#categorySelect').on('changed.bs.select', function (e) {
    console.log(e);
});
$('#colorSelect').on('changed.bs.select', function (e) {
    console.log(e);
});


function updateEvents(startDateFrom, endDateTo, selectedCategories, selectedColors, searchString) {
    $.ajax({
      type: 'GET',
      url: '/events',
      data: { 
            start: startDateFrom, 
            end: endDateTo, 
            categories: selectedCategories,
            colors: selectedColors,
            search: searchString
      },
      success: function(result) {
        updateGraphs(result);
      }
    });
}
        