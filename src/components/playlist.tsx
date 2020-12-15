import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

//Fake data for testing
const fakeData:object=
	{id:1,
	name:"playlist1",
	tracks:[{id:1,name:"track1"},{id:2,name:"track2"},{id:3,name:"track3"}]
	}

const Playlist = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ playlistData, setPlaylistData]=useState<any>([]);
    const [ id	, setId ] = useState<number>(NaN);
    let list:Array<object> = [];

	const getPlayList = async (tok: string, id: string) => {
		try {
			const reqUrl = 'https://api.spotify.com/v1/playlists/' + id;
			const { data } = await axios.get(reqUrl, {
				headers: {
					Authorization: 'Bearer ' + tok
				}
			});
			return data;
		} catch (e) {
			throw new Error("Request failed");
		}
	}


    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true)

			const playlist = await getPlayList(props.location.state[0].token, props.match.params.id);
			setPlaylistData(playlist)
			//Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
			setId(props.match.params.id)

			setLoading(false)
			
		}
		fetchData();
    }, [props.match.params.id]); 
    
	//Builds list of character links
	//TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something
    const buildList = (song:any) => {
		return (
			<li key={song.id}><Link className="siteLink"  
				to={{
					pathname: `/songs/${song.track.id}`,
					state: [{ token: props.location.state[0].token }]
				}}>{song.track.name}</Link> </li>
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
        list =
			tracks &&
			tracks.map((song) => {
				return buildList(song);

    });
			//TODO: pagination
            return (
                <div>
                    <h1>{playlistData["name"]}: {id}</h1>

                    <br />
                    <br />
                    <ul>
                        {list}
                    </ul>
                </div>
            );

    }
};

export default Playlist;
