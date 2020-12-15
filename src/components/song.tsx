import React, { useState, useEffect } from 'react';
import axios from 'axios';

//Fake data for testing
const fakeData:object=
	{id:1,
	name:"track1",
	album:"album3"
	}

const getSong = async (tok: string, id: string) => {
	try {
		const reqUrl = 'https://api.spotify.com/v1/tracks/' + id;
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


const Song = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ songData, setSongData]=useState<any>([]);
    const [ id	, setId ] = useState<number>(NaN);

    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true)

			const song = await getSong(props.location.state[0].token, props.match.params.id);
			
			setSongData(song)
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
            return (
                <div>
                    <h1>Title</h1>
					<p>{songData["name"]}: {id}</p>
					<h1>Album</h1>
					<p>{songData["album"]["name"]}</p>
                    <br />
                    <br />
                </div>
			);
		}

    };

export default Song;
