import React, { useState, useEffect } from 'react';
import axios from 'axios';
import BarChart from './BarChart';

//Fake data for testing
const fakeData:object=
	{id:1,
	name:"track1",
	album:"album3"
	}

const state:any = {
	data: [120, 1, 7, 6, 9, 10],
	width: 700,
	height: 500,
	id: "root"
}

const Song = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ songData, setSongData]=useState<any>([]);
	const [ id	, setId ] = useState<number>(NaN);
	const [ track, setTrack ] = useState<string>("");

    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true)

			const songResp: any = await axios.get('http://localhost:8888/spotify-song?tok='+props.location.state[0].token+'&id='+props.match.params.id);
			const song: any = songResp['data'];
			console.log(song);
			setSongData(song)
			setTrack(song["uri"]);
			//Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
			setId(props.match.params.id)

			setLoading(false)
			
		}
		fetchData();
    }, [props.match.params.id]); 
    
	//Builds list of character links
	//TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something

    
    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
        );
    }
	//Build list of songs in playlist			//TODO: pagination
	else{
			console.log(state.data);
            return (
                <div>
                    <h1>Title</h1>
					<p>{songData["name"]}: {id}</p>
					<h1>Album</h1>
					<p>{songData["album"]["name"]}</p>
					<img src={songData["album"]["images"][1]["url"]} alt="album art"/>
                    <br />
                    <br />
					<BarChart data={state.data} height={state.height} width={state.width} id={state.id}/>
                </div>
			);
		}
};

export default Song;
