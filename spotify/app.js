/**
 * This is an example of a basic node.js script that performs
 * the Authorization Code oAuth2 flow to authenticate against
 * the Spotify Accounts.
 *
 * For more information, read
 * https://developer.spotify.com/web-api/authorization-guide/#authorization_code_flow
 */

var express = require("express"); // Express web server framework
var request = require("request"); // "Request" library
var cors = require("cors");
var querystring = require("querystring");
var cookieParser = require("cookie-parser");
var bluebird = require("bluebird");
var redis = require("redis");
let axios = require("axios");

const client = redis.createClient(process.env.REDIS_URL);

bluebird.promisifyAll(redis.RedisClient.prototype);
bluebird.promisifyAll(redis.Multi.prototype);

var client_id = "e66c0a3b27c74129bc4e155e8300278e"; // Your client id
var client_secret = "88019a73ec9e4893805bd5125db4b7f3"; // Your secret
var redirect_uri = "http://cs554-final.herokuapp.com/callback"; // Your redirect uri

/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
var generateRandomString = function (length) {
  var text = "";
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

var stateKey = "spotify_auth_state";

var app = express();

app
  .use(express.static(__dirname + "/public"))
  .use(cors())
  .use(cookieParser());

app.get("/spotify-song", async function (req, res) {
  let tok = req.query.tok;
  let id = req.query.id;
  let songKey = "s" + id;

  let exists = await client.existsAsync(songKey);
  if (exists) {
    console.log("Song in cache");
    let song = await client.getAsync(songKey);
    res.send(JSON.parse(song));
  } else {
    console.log("Song not in cache");
    try {
      const reqUrl = "https://api.spotify.com/v1/tracks/" + id;
      const { data } = await axios.get(reqUrl, {
        headers: {
          Authorization: "Bearer " + tok,
        },
      });
      await client.setAsync(songKey, JSON.stringify(data));
      res.send(data);
    } catch (e) {
      throw new Error("Request failed");
    }
  }
});

app.get("/spotify-playlist", async function (req, res) {
  let tok = req.query.tok;
  let id = req.query.id;
  let playlistKey = "p" + id;

  let exists = await client.existsAsync(playlistKey);
  if (exists) {
    let playlist = await client.getAsync(playlistKey);
    res.send(JSON.parse(playlist));
  } else {
    try {
      const reqUrl = "https://api.spotify.com/v1/playlists/" + id;
      const { data } = await axios.get(reqUrl, {
        headers: {
          Authorization: "Bearer " + tok,
        },
      });
      await client.setAsync(playlistKey, JSON.stringify(data));
      res.send(data);
    } catch (e) {
      throw new Error("Request failed");
    }
  }
});

app.get("/login", function (req, res) {
  var state = generateRandomString(16);
  res.cookie(stateKey, state);

  // your application requests authorization
  var scope =
    "streaming user-read-private user-read-email user-modify-playback-state app-remote-control user-read-playback-state user-read-currently-playing playlist-read-private";
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: client_id,
        scope: scope,
        redirect_uri: redirect_uri,
        state: state,
      })
  );
});

app.get("/callback", function (req, res) {
  // your application requests refresh and access tokens
  // after checking the state parameter

  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[stateKey] : null;

  if (state === null || state !== storedState) {
    res.redirect(
      "/#" +
        querystring.stringify({
          error: "state_mismatch",
        })
    );
  } else {
    res.clearCookie(stateKey);
    var authOptions = {
      url: "https://accounts.spotify.com/api/token",
      form: {
        code: code,
        redirect_uri: redirect_uri,
        grant_type: "authorization_code",
      },
      headers: {
        Authorization:
          "Basic " +
          new Buffer(client_id + ":" + client_secret).toString("base64"),
      },
      json: true,
    };

    request.post(authOptions, function (error, response, body) {
      if (!error && response.statusCode === 200) {
        var access_token = body.access_token,
          refresh_token = body.refresh_token;

        var options = {
          url: "https://api.spotify.com/v1/me",
          headers: { Authorization: "Bearer " + access_token },
          json: true,
        };

        // use the access token to access the Spotify Web API
        request.get(options, function (error, response, body) {
          //console.log(body);
        });

        // we can also pass the token to the browser to make requests from there
        res.redirect(
          "http://localhost:3000/login/#" +
            querystring.stringify({
              access_token: access_token,
              refresh_token: refresh_token,
            })
        );
      } else {
        res.redirect(
          "/#" +
            querystring.stringify({
              error: "invalid_token",
            })
        );
      }
    });
  }
});

app.get("/refresh_token", function (req, res) {
  // requesting access token from refresh token
  var refresh_token = req.query.refresh_token;
  var authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(client_id + ":" + client_secret).toString("base64"),
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token,
    },
    json: true,
  };

  request.post(authOptions, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token,
      });
    }
  });
});

app.listen(process.env.PORT || 3000);
