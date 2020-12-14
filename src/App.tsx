import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route} from 'react-router-dom';
import Home from './components/home';
import Login from './components/login';
import Songs from './components/songs';
import Song from './components/song';
import Playlists from './components/playlists';
import Playlist from './components/playlist';

function App() {
  return (
    <Router>
    <div className="App">
      <header className="App-header">
      </header>
      <div className='App-body'>
      <Route exact path='/' component={Home} />
      <Route exact path='/login/' component={Login} />
      <Route exact path='/songs/page/:pagenum' component={Songs} />
      <Route exact path='/songs/:id' component={Song} />
      <Route exact path='/playlists/page/:pagenum' component={Playlists} />
      <Route exact path='/playlists/:id' component={Playlist} />
      </div>
    </div>
    </Router>
  );
}

export default App;
