import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { Card, CardActionArea, CardContent, CardMedia, Grid, Typography,makeStyles } from '@material-ui/core';


const useStyles = makeStyles((theme) => ({
	root: {
	  flexGrow: 1,
	  flexDirection: 'row'
	}
  }));

const Playlist = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ playlistData, setPlaylistData]=useState<any>([]);
    const [ id	, setId ] = useState<number>(NaN);
	const classes=useStyles();
	let card:Array<any>=[];
    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true);
			console.log('e');

			const playlistResp = await axios.get('http://localhost:8888/spotify-playlist?tok='+props.location.state[0].token+'&id='+props.match.params.id);
			const playlist = playlistResp['data'];
			console.log(playlist);
			setPlaylistData(playlist)
			//Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
			setId(props.match.params.id)

			setLoading(false)
			
		}
		fetchData();
    }, [props.match.params.id,props.location.state]); 
    
	//Builds list of character links
	//TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something
    const buildCard = (song:any) => {
		return (
			<Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={song.track.id}>
				<Card className="card">
					<CardActionArea>
							<CardMedia
								component='img'
								image={song.track.album.images[0].url}
								title='show image'
							/>
							<CardContent>
								<Typography variant='h5'>
									{song.track.name}
								</Typography>
								<Typography variant="body1">
									By: {song.track.artists[0].name}
								</Typography>
								<Typography variant="body2">
									Length: {song.track.duration_ms}
								</Typography>
								<Link to={{
									pathname: `/songs/${song.track.id}`,
									state: [{ token: props.location.state[0].token }]
											}}>
											<button>
												Listen
											</button>
											</Link>
							</CardContent>
						
					</CardActionArea>
				</Card>
			</Grid>
		);
	};

    
    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
        );
    }
    //Build list of songs in playlist
    else{
		const tracks:Array<any> =playlistData["tracks"]["items"]
        card =
			tracks &&
			tracks.map((song) => {
				return buildCard(song);

    });
			//TODO: pagination
			
            return (
                <div className={classes.root}>
                    <h1>{playlistData["name"]}: {id}</h1>

                    <br />
                    <br />
					<Grid container spacing={10} >
						{card}
					</Grid>
                </div>
            );

    }
};

export default Playlist;
