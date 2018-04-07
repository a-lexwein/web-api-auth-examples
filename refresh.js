const { Client } = require('pg');
const payloadToSongArray = require('./payloadToSongArray.js');

const client = new Client({
  host: 'spotty.cgszne64zlop.us-west-2.rds.amazonaws.com',
  database: 'spotty',
  port: 5432,
  user: 'alex',
});

client.connect();


// Uses some copy-pasted code from Spotify's web-api-auth-examples repo.

require('dotenv').config(); // to uses process.env vars defined in .env
const AWS = require('aws-sdk');
const request = require('request'); // "Request" library

AWS.config.update({
  region: 'us-west-2',
});

// Dynamo set up was done in console
var docClient = new AWS.DynamoDB.DocumentClient();

// Refresh token came from external authentication process
var refresh_token = 'AQA3ygVlI1sym4IG7ZyMceqTPbt0E_VP7L-phvp5SQVDjS-WLNzwRZc_8Ae6GUN9EdzeqUpCvilSrUXw_qDDRAtCk6HzhkKoi5hUjhv0dJVeu2RNrkJmMzSb6Iq_hAndMHw'

var client_id = process.env.CLIENT_ID; // Your client id
var client_secret = process.env.CLIENT_SECRET;

var refreshAnd = async function(refresh_token, cb) {
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: { 'Authorization': 'Basic ' + (new Buffer(client_id + ':' + client_secret).toString('base64')) },
    form: {
      grant_type: 'refresh_token',
      refresh_token: refresh_token
    },
    json: true
  };

  var token = ''
  request.post(authOptions, async function(error, response, body) {
    if (!error && response.statusCode === 200) {
      token = await body.access_token;
      cb(token)
    };
  })
}

getHistory = function(access_token) {
  var options = {
    url: 'https://api.spotify.com/v1/me/player/recently-played?limit=50',
    headers: { 'Authorization': 'Bearer ' + access_token },
    json: true
  };
  request.get(options, function(error, response, body) {
    // var params = {
    //   TableName: 'history',
    //   Item: {timestamp: String(Date.now()), body: body},
    // }
    //docClient.put(params, console.log)

    let songs = payloadToSongArray(body)
    let tracks = songs.tracks

    const trackToInsertLine = ({id, name, duration_ms, played_at}) => `('${id}', '${name}', ${duration_ms}, '${played_at}')`
    tracks.map(trackToInsertLine).join(',')

    const query = `
      INSERT INTO HistoryAlex(track_id, track_name, duration_ms, played_at) VALUES
      ${tracks.map(trackToInsertLine).join(',')};
    `

    console.log(query)
    // NOTE Postgres Stuff
    client.query(query, (x,y) => {
      console.log('x', x);
      console.log('y', y);
      client.end()
    });
// // console.log(JSON.stringify(payloadToSongArray(body)))
// console.log(JSON.stringify(payloadToSongArray(body).tracks[1]))
//
//
// client.end();
  });
}

refreshAnd(refresh_token, getHistory)




// ['name', 'id', 'artists', 'duration_ms', 'played_at'];
// artists: name id
