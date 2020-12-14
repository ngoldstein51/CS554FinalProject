import React from 'react';
import { Link } from 'react-router-dom';
import '../App.css';


const Home = ():JSX.Element => {
	//TODO: make it so homepage redirects you to playlists if logged in.
	//No api calls needed
	return (
		<div>
			<h1>
				Welcome to Spotify Playlist Website
			</h1>
			<Link className="siteLink" to="/login">
			Login with Spotify
			</Link>

		</div>
	);
};

export default Home;
