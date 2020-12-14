import React, { useState, useEffect } from 'react';
//import axios from 'axios';
import { Link } from 'react-router-dom';

//Fake data for testing
const fakeData:Array<object>=[
	{id:1,
	name:"playlist1"},
	{id:2,
		name:"playlist2"},
	{id:3,
	name:"playlist3"}
]



const Playlists = (props:any) =>{
    const [ loading, setLoading ] = useState<boolean>(true);
    const [ playlistData, setPlaylistData]=useState<Array<object>>([]);
    const [ pageNum, setPageNum ] = useState<number>(NaN);
    let list:Array<object> = [];

    //load
    useEffect(():void => {
		async function fetchData() {
			setLoading(true)
			//TODO: API call
			setPlaylistData(fakeData)
			//Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
			setPageNum(props.match.params.pagenum)


			setLoading(false)
			
		}
		fetchData();
    }, [props.match.params.pagenum]); 
    
	//Builds list of playlists
	//TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something
    const buildList = (playlist:any) => {
		return (
			<li key={playlist.id}><Link className="siteLink"  to={`/playlists/${playlist.id}`}>{playlist.name}</Link> </li>
		);
	};

    
    if (loading) {
		return (
			<div>
				<h2>Loading....</h2>
			</div>
        );
    }
    //Build list of playlists
    else{
        list =
			playlistData &&
			playlistData.map((playlist) => {
				return buildList(playlist);

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

export default Playlists;
