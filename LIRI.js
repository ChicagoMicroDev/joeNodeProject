require('dotenv').config();
var Twitter = require('twitter');
var request = require('request');
var Spotify = require('node-spotify-api');
var keys = require("./keys.js");
var fs = require('fs');
var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);
// Take in user input
var nodeArg = process.argv;
var argCommand = process.argv[2];

var mult = "";
for(var i = 3; i < nodeArg.length; i++){
    if(i>3 && nodeArg){
        mult = mult + "+" + nodeArg[i];
    }else {
        mult = mult + nodeArg[i];
    }
}

switch (argCommand) {
    case "my-tweets":
    twitterGrab();
    break;

    case "spotify-this-song":
        if(argCommand){
            spotifyInfo(argCommand);
        }else{
            spotifyInfo("Fluorescent Adolescent")
        }
        break;
    case "movie-this":
        if(argCommand){
            omdbinfo(argCommand)
        }else {
            omdbinfo("Mr. Nobody")
        }
        break;
    case "do-what-it-says":
            doThing();
        break;
    default:
        console.log("Default commands are my-tweets, spotify-this-song, movie-this, do-what-it-says");
        break;
}
//Create a function  that get 20 tweets from dummy twitter account
function twitterGrab(){
var screenName = {screen_name: "Joe15798327"};
    client.get('statuses/user_timeline', screenName, function(error, tweets, response){
        if(!error){
            for(var i = 0; i < tweets.length; i++){
                var date = tweets[i].created_at;
                console.log("@Joe15798327: " + tweets[i].text + " Created at : " + date.substring(0, 19));
            }
        }else {
            console.log('Error occurred');
        }
    })
}
// create a function that get information on a song that the user type in from spotify
function spotifyInfo(){
    spotify.search({ type: 'track', query: song}, function(error, data) {
        if (!error) {
            for (var i = 0; i < data.tracks.items.length; i++) {
                var songData = data.tracks.items[i];
                console.log("Artist: " + songData.artists[0].name);

                console.log("Song: " + songData.name);
                console.log("Preview URL: " + songData.preview_url);
                console.log("Album: " + songData.album.name);
            }
        }

    })
}
// Create a function that takes take the text in the .random file and then uses what written there to run one of the three commans
function txtGrabber() {

}
function omdbinfo() {
    var omdbURL = 'http://www.omdbapi.com/?t=' + movie + '&plot=short&tomatoes=true';

    request(omdbURL, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var body = JSON.parse(body);

            console.log("Title: " + body.Title);
            console.log("Release Year: " + body.Year);
            console.log("IMdB Rating: " + body.imdbRating);
            console.log("Country: " + body.Country);
            console.log("Language: " + body.Language);
            console.log("Plot: " + body.Plot);
            console.log("Actors: " + body.Actors);
            console.log("Rotten Tomatoes Rating: " + body.tomatoRating);
            console.log("Rotten Tomatoes URL: " + body.tomatoURL);

        } else{
            console.log('Error occurred.')
        }
        if(movie === "Mr. Nobody"){
            console.log("If you haven't watched 'Mr. Nobody,' then you should: http://www.imdb.com/title/tt0485947/");
            console.log("It's on Netflix!");
        }
    })
}
function doThing(){
    fs.readFile('random.txt', "utf8", function(error, data){
        var txt = data.split(',');

        spotifySong(txt[1]);
    });
}

