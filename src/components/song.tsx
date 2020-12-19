import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {FaPlay} from 'react-icons/fa';
import {Redirect} from "react-router-dom"

const Song = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ songData, setSongData]=useState<any>([]);
	//load
	useEffect((): void => {
		async function fetchData() {
			setLoading(true);
			if(props.location.state!==undefined){
			const songResp: any = await axios.get('https://cs554-final.herokuapp.com/spotify-song?tok='+props.location.state[0].token+'&id='+props.match.params.id);
			
			const song: any = songResp['data'];
			console.log(songResp)
			setSongData(song)

			setLoading(false)
			}
		}
		fetchData();
	}, [props.match.params.id,props.location.state]);

	if(props.location.state===undefined){
		return(
			<Redirect to="/"/>
		)
	}

	

	if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
		);
	}
	//Build list of songs in playlist			//TODO: pagination
	else {
		return (
			<div>
				<h1>{songData["name"]}</h1>
				<h1>Album: {songData["album"]["name"]}</h1>
				
				<div onClick={() => {
					props.setURI(songData['uri']);
					props.setOffset(-1);
				}}>
					<FaPlay />
				</div>
				<img src={songData.album.images[0].url} alt="Album Cover"/> 
				<br />
				<br />
			</div>
		);
	}
};

export default Song;
