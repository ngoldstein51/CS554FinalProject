import { useEffect, useState } from 'react';
import '../App.css';

const Player = (props: any): JSX.Element => {
    const [playerReady, setPlayerReady] = useState(false);
    const [playbackOn, setPlaybackOn] = useState(false);
    const [playbackPaused, setPlaybackPaused] = useState(true);
    const [spotifyDeviceId, setDeviceId] = useState<string>();

    

    console.log('Token:', props.token);
    console.log('Song ID:', props.uri);

    useEffect(() => {
        let spotifyPlayer: Spotify.SpotifyPlayer;
        const createPlayer = () => {
            // Create the player object
            const player = new Spotify.Player({
                name: 'Spotify Web Player',
                getOAuthToken: cb => { cb(props.token) }
            })
            console.log('Player has been created');
            spotifyPlayer = player;
    
            // Ready
            spotifyPlayer?.addListener('ready', ({ device_id }) => {
                console.log('Web Device ID:', device_id);
                setDeviceId(device_id);
            });
    
            spotifyPlayer?.addListener('not_ready', ({ device_id }) => {
                console.log('Device ID is not ready for playback', device_id);
            });
    
            // Connect
            spotifyPlayer?.connect().then(() => {
                console.log('Spotify Web Player Connected');
                setPlayerReady(true);
            });
    
        };
    
        // Add script to body of document
        const script = document.createElement('script');
        script.src = "https://sdk.scdn.co/spotify-player.js";
        script.async = true;
        // Add listener for onLoad event
        window.onSpotifyWebPlaybackSDKReady = () => {
            createPlayer();
        };
        document.body.appendChild(script);
        return () => {
            document.body.removeChild(script);
        }
    }, [props.token]);

    const pauseTrack = () => {
        fetch("https://api.spotify.com/v1/me/player/pause?device_id=" + spotifyDeviceId, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
        }).then((ev) => {
            setPlaybackPaused(true);
            setPlaybackOn(false);
        })
    }

    const startPlayback = (spotify_uri: string) => {
        console.log('Device ID:', spotifyDeviceId)
        const url: string = 'https://api.spotify.com/v1/me/player/play?device_id=' + spotifyDeviceId;
        fetch(url, {
            method: 'PUT',
            body: JSON.stringify({ uris: [spotify_uri] }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + props.token
            },
        });
        setPlaybackOn(true);
        setPlaybackPaused(false);
        console.log('playing a song?')
    }

    return (
        <div>
            <div>
                {playerReady &&
                    <div onClick={() => {
                        if (!playbackOn) {
                            startPlayback(props.uri);
                        } else {
                            if (playbackPaused) {
                                startPlayback(props.uri);
                            }
                        }
                    }}>
                        <p>Play</p>
                    </div>}
                {playerReady && playbackOn &&
                    <div onClick={() => {
                        if (!playbackPaused) {
                            pauseTrack();
                        }
                    }}>
                        <p>Pause</p>
                    </div>}
            </div>
        </div>
    );
};

export default Player;