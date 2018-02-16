const fs = require('fs');
const readline = require('readline');
const google = require('googleapis');
const googleAuth = require('google-auth-library');
const util = require('util');
const credentials = require('./../../configs/client_secret.js')

function authorize(refresh_token, token) {
  var clientSecret = credentials.web.client_secret;
  var clientId = credentials.web.client_id;
  var redirectUrl = credentials.web.redirect_uris[0];
  var auth = new googleAuth();
  var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  oauth2Client.credentials = { refresh_token: refresh_token, access_token: token };
  
  return oauth2Client; 
}

function listEvents(refresh_token, token) {
  
    let auth = authorize(refresh_token, token);
    var calendar = google.calendar('v3');
    var before = new Date();
    var beforeDate = new Date(before.getTime() - 365 * 24 * 60 * 60 * 1000);
    return new Promise(function(resolve,reject){
        let request = calendar.events.list({
            auth: auth,
            calendarId: 'primary',
            timeMin: (beforeDate).toISOString(),
            maxResults: 50000,
            singleEvents: true,
            orderBy: 'startTime'
        }, function(err, resp) {
              if(err) {
                  console.log(err);
                  reject(err);
              }
              var events = resp.items;
              resolve(events);
            });
    });     
}

module.exports = {
    listEvents: listEvents
}