import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';

//Fake data for testing
const fakeData:Array<object>=[
	{id:1,
	name:"track1",
	album:"album2"},
	{id:2,
	name:"track2",
	album:"album4"},
	{id:3,
	name:"track3",
	album:"album8"}
]



const Songs = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ songData, setSongData]=useState<Array<object>>([]);
    const [ pageNum, setPageNum ] = useState<number>(NaN);
    let list:Array<object> = [];

    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true)
			//TODO: API call
			setSongData(fakeData)
			//Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
			setPageNum(props.match.params.pagenum)


			setLoading(false)
			
		}
		fetchData();
    }, [props.match.params.pagenum]); 
    
	//Builds list of playlists
	//TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something
    const buildList = (song:any) => {
		return (
			<li key={song.id}><Link className="siteLink"  to={`/songs/${song.id}`}>{song.name} -{song.album}</Link> </li>
		);
	};

    
    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
        );
    }
    //Build list of songs
    else{
        list =
			songData &&
			songData.map((song) => {
				return buildList(song);

    });
			//TODO: pagination
            return (
                <div>
                    <h1>Playlists Page: {pageNum}</h1>
                    <br />
                    <br />
                    <ul>
                        {list}
                    </ul>
                </div>
            );

    }
};

export default Songs;
