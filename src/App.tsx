import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "./components/home";
import Login from "./components/login";
import Song from "./components/song";
import Playlists from "./components/playlists";
import Playlist from "./components/playlist";
import Player from "./components/player";
import { makeStyles, Container, AppBar } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  appBar: {
    top: "auto",
    bottom: 0,
  },
}));

function App() {
  const classes = useStyles();
  const [spotifyURI, setSpotifyURI] = React.useState<string>("");
  const [token, setToken] = React.useState<string>("");
  const [spotifyOffset, setSpotifyOffset] = React.useState<number>(-1);

  React.useEffect(() => {
    console.log("App -> spotifyURI:", spotifyURI);
  }, [spotifyURI]);

  React.useEffect(() => {
    console.log("App -> token:", token);
  }, [token]);

  React.useEffect(() => {
    console.log("App -> spotifyOffset:", spotifyOffset);
  }, [spotifyOffset]);

  return (
    <Router>
      <div className="App">
        <header className="App-header"></header>
        <Container>
          <div className="App-body">
            
            <Route exact path="/" component={Home} />
            <Route
              exact
              path="/login/"
              render={(props) => <Login {...props} passBackToken={setToken} />}
            />
            <Route
              exact
              path="/songs/:id"
              render={(props) => (
                <Song
                  {...props}
                  setURI={setSpotifyURI}
                  setOffset={setSpotifyOffset}
                />
              )}
            />
            <Route exact path="/playlists/page/:pagenum" component={Playlists} />
            <Route
              exact
              path="/playlists/:id"
              render={(props) => (
                <Playlist
                  {...props}
                  setURI={setSpotifyURI}
                  setOffset={setSpotifyOffset}
                />
              )}
            />
          </div>
          <AppBar position="fixed" className={classes.appBar}>
            <Player token={token} uri={spotifyURI} offset={spotifyOffset} />
          </AppBar>
        </Container>
      </div>
    </Router>
  );
}

export default App;
