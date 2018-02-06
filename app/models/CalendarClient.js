const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const util = require('util');

// If modifying these scopes, delete your previously saved credentials
// at ~/.credentials/calendar-nodejs-quickstart.json
var SCOPES = ['https://www.googleapis.com/auth/calendar.readonly'];

var TOKEN_PATH = './configs/client_data.json';

//Load client secrets from a local file.
//fs.readFile('./configs/client_secret.json', function processClientSecrets(err, content) {
//
//    if (err) {
//    console.log('Error loading client secret file: ' + err);
//    return;
//    }
//    authorize(JSON.parse(content), listEvents);
//    
//});

var authClient = {};

/**
 * Create an OAuth2 client with the given credentials, and then execute the
 * given callback function.
 *
 * @param {Object} credentials The authorization client credentials.
 * @param {function} callback The callback to call with the authorized client.
 */
function authorize(credentials, callback) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);

  // Check if we have previously stored a token.
  fs.readFile(TOKEN_PATH, function(err, token) {
    //if (err || !token || token == "") {
      getNewToken(oauth2Client, callback);
//    } else {
//        
//      var tokenJson = token.toString('utf8')
//      console.log(tokenJson);
//      oauth2Client.credentials = tokenJson;
//      callback(oauth2Client);
//    }
  });
}

/**
 * Get and store new token after prompting for user authorization, and then
 * execute the given callback with the authorized OAuth2 client.
 *
 * @param {google.auth.OAuth2} oauth2Client The OAuth2 client to get token for.
 * @param {getEventsCallback} callback The callback to call with the authorized
 *     client.
 */
function getNewToken(oauth2Client, callback) {
  var authUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES
  });
  console.log('Authorize this app by visiting this url: ', authUrl);
  var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });
  rl.question('Enter the code from that page here: ', function(code) {
    rl.close();
    oauth2Client.getToken(code, function(err, token) {
      console.log(token);    
      if (err) {
        console.log('Error while trying to retrieve access token', err);
        return;
      }
      oauth2Client.credentials = token;
      storeToken(token);
      authClient = oauth2Client;
      callback(oauth2Client);
    });
  });
}

/**
 * Store token to disk be used in later program executions.
 *
 * @param {Object} token The token to store to disk.
 */
function storeToken(token) {
  fs.writeFile(TOKEN_PATH, JSON.stringify(token));
  console.log('Token stored to ' + TOKEN_PATH);
}

function listEvents(auth) {
  
    var calendar = google.calendar('v3');
    var before = new Date();
    var beforeDate = new Date(before.getTime() - 2 * 365 * 24 * 60 * 60 * 1000);
    return new Promise(function(resolve,reject){
        var request = calendar.events.list({
        auth: auth,
        calendarId: 'primary',
        timeMin: (beforeDate).toISOString(),
        maxResults: 100000,
        singleEvents: true,
        orderBy: 'startTime'
        });
        
        //console.log(request);

        request.execute(function(err, resp) {
          if(err) {
              reject(err);
          }
          var events = resp.items;
          //After the request is executed, you will invoke the resolve function with the result as a parameter.
          resolve(events);
        });
    });     
}

//    , function(err, response) {
//    if (err) {
//      console.log('The API returned an error: ' + err);
//      return;
//    }
//    var events = response.items;
//    if (events.length == 0) {
//      console.log('No upcoming events found.');
//    } else {
//      console.log('Upcoming 10 events:');
//      for (var i = 0; i < events.length; i++) {
//        var event = events[i];
//        var start = event.start.dateTime || event.start.date;
//        console.log('%s - %s', start, event.summary);
//      }
//    }
//  }

module.exports = {
    listEvents: listEvents
}