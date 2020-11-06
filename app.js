require('dotenv').config();
const SpotifyWebApi = require('spotify-web-api-node');

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:

const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
  });
  
  // Retrieve an access token
  spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));

const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:

// Our routes go here:

app.get('/', (req, res) => {
    res.render('index');
});

app.get('/artist-search', (req, res) => {
  spotifyApi
  .searchArtists(req.query.searchArtists)
  .then(data => {
    let artistData = data.body.artists.items;
    console.log('The received data from the API: ', data.body.artists.items);
    //console.log(req.query.searchArtists);
    res.render('artist-search-results', {artistData})
  })
  .catch(err => console.log('The error while searching artists occurred: ', err));
});

app.get('/albums/:artistId', (req, res) => {
  spotifyApi
  .getArtistAlbums(req.params.artistId).then(
    function(data) {
      let albumData = data.body.items;
      console.log('Artist albums', data.body.items);
      res.render('albums', {albumData})
    })
  .catch(err => console.log('The error while searching artists occurred: ', err));;
  });

  app.get('/tracks/:albumId', (req, res) => {
    spotifyApi
    .getAlbumTracks(req.params.albumId).then(
      function(data) {
        let trackData = data.body.items;
        console.log('track list', data.body.items);
        res.render('viewTracks', {trackData})
      })
    .catch(err => console.log('The error while searching artists occurred: ', err));;
    });

app.listen(3000, () => console.log('My Spotify project running on port 3000 🎧 🥁 🎸 🔊'));

