import React from 'react';
import '../App.css';
import {Button,makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	button: {
	  backgroundColor: "lightgray",
	  textDecoration: "none",
	},
  }));
const Home = ():JSX.Element => {
	//TODO: make it so homepage redirects you to playlists if logged in.
	//No api calls needed
	const classes=useStyles();
	return (
		<div>
			<h1>
				Welcome to Spotify Playlist Website
			</h1>
			<p>This is a website where you can view and listen to Spotify playlists if you sign in with your account.</p>
			<a href="http://localhost:8888/login" >
				<Button className={classes.button}>Login with Spotify</Button>	
			</a>

		</div>
	);
};

export default Home;
