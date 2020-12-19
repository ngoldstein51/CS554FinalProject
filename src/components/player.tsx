import { useEffect, useState } from "react";
import { FaPlay, FaPause, FaChevronRight, FaChevronLeft } from "react-icons/fa";
import { Grid, Typography, LinearProgress } from "@material-ui/core";
import "../App.css";

interface props {
  token: string;
  uri: string;
  offset: number;
}

const Player = ({ token, uri, offset }: props): JSX.Element => {
  const [playerReady, setPlayerReady] = useState(false);
  const [playbackOn, setPlaybackOn] = useState(false);
  const [playbackPaused, setPlaybackPaused] = useState(false);
  const [spotifyDeviceId, setDeviceId] = useState<string>();
  const [trackName, setTrackName] = useState<string>("No Track");
  const [trackLength, setTrackLength] = useState<number>(NaN);
  const [progress, setProgress] = useState<number>(0);

  // Loading Progress Bar
  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((oldProgress) => {
        if (playbackOn && (!isNaN(trackLength))) {
          if (oldProgress === 100) {
            getCurrentPlayback();
            return 0;
          }
          const timeInMilli = (trackLength + 800) * (oldProgress / 100);
          const newTime = timeInMilli + 100;
          return Math.min(((newTime / (trackLength + 800)) * 100), 100);
        }
        return oldProgress;
      });
    }, 100);

    return () => {
      clearInterval(timer);
    };
  }, [playbackOn, trackLength]);

  // Checking token is valid
  useEffect(() => {
    console.log("Player -> token:", token);
    let spotifyPlayer: Spotify.SpotifyPlayer;
    const createPlayer = () => {
      // Create the player object
      const player = new Spotify.Player({
        name: "Spotify Web Player",
        getOAuthToken: (cb) => {
          cb(token);
        },
      });
      console.log("Player has been created");
      spotifyPlayer = player;

      // Ready
      spotifyPlayer?.addListener("ready", ({ device_id }) => {
        console.log("Web Device ID:", device_id);
        setDeviceId(device_id);
      });

      spotifyPlayer?.addListener("not_ready", ({ device_id }) => {
        console.log("Device ID is not ready for playback", device_id);
      });

      // Connect
      spotifyPlayer?.connect().then(() => {
        console.log("Spotify Web Player Connected");
        setPlayerReady(true);
      });
    };
    if (token !== "") {
      // Add script to body of document
      const script = document.createElement("script");
      script.src = "https://sdk.scdn.co/spotify-player.js";
      script.async = true;
      // Add listener for onLoad event
      window.onSpotifyWebPlaybackSDKReady = () => {
        createPlayer();
      };
      document.body.appendChild(script);
      return () => {
        document.body.removeChild(script);
      };
    }
  }, [token]);

  // Get our current playback info
  function getCurrentPlayback() {
    fetch("https://api.spotify.com/v1/me/player/currently-playing", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((response) => response.text())
      .then((response) => {
        const track = JSON.parse(response);
        setTrackName(track.item.name);
        setTrackLength(track.item.duration_ms);
      })
      .catch((err) => console.log("Ignore error"));
  }

  // Paush Track
  const pauseTrack = () => {
    fetch(
      "https://api.spotify.com/v1/me/player/pause?device_id=" + spotifyDeviceId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).then((ev) => {
      setPlaybackPaused(true);
      setPlaybackOn(false);
      console.log("Pausing song");
    });
  };

  // Start Track
  const startPlayback = (spotify_uri: string) => {
    console.log("Device ID:", spotifyDeviceId);
    console.log("Spotify URI:", spotify_uri);
    const url: string =
      "https://api.spotify.com/v1/me/player/play?device_id=" + spotifyDeviceId;
    if (spotify_uri.includes("track:")) {
      // If playing just one track
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({ uris: [spotify_uri] }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((ev) => {
        setPlaybackOn(true);
        setPlaybackPaused(false);
        setProgress(0);
        getCurrentPlayback();
        console.log("Playing song");
      });
    } else {
      // If playing playlist
      fetch(url, {
        method: "PUT",
        body: JSON.stringify({
          context_uri: spotify_uri,
          offset: { position: offset },
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((ev) => {
        setPlaybackOn(true);
        setPlaybackPaused(false);
        getCurrentPlayback();
        setProgress(0);
        console.log("Playing song");
      });
    }
  };

  // New track is selected
  useEffect(() => {
    console.log("Player -> uri:", uri);
    startPlayback(uri);
    // eslint-disable-next-line
  }, [uri, offset]);

  // Remuse playback of track
  const resumePlayback = () => {
    fetch(
      "https://api.spotify.com/v1/me/player/play?device_id=" + spotifyDeviceId,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    ).then((ev) => {
      setPlaybackOn(true);
      setPlaybackPaused(false);
      console.log("Resuming song");
    });
  };

  // Next
  const nextTrack = () => {
    fetch("https://api.spotify.com/v1/me/player/next", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((ev) => {
      getCurrentPlayback();
      setProgress(0);
      console.log("Next song");
    });
  };

  // Previous
  const previousTrack = () => {
    fetch("https://api.spotify.com/v1/me/player/previous", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then((ev) => {
      getCurrentPlayback();
      setProgress(0);
      console.log("Previous song");
    });
  };

  return (
    <div>
      <div>
        {playerReady && <Typography>Playing: {trackName} </Typography>}
        {playerReady && (
          <LinearProgress variant="determinate" color='secondary' value={progress} />
        )}
        <Grid
          container
          direction="row"
          justify="center"
          alignItems="center"
          spacing={3}
        >
          {playerReady && trackName !== "No Track" && !uri.includes("track:") && (
            <Grid
              item
              onClick={() => {
                previousTrack();
              }}
            >
              <FaChevronLeft size={30} />
            </Grid>
          )}
          {playerReady && trackName !== "No Track" && !playbackOn && (
            <Grid
              item
              onClick={() => {
                if (!playbackOn && !playbackPaused) {
                  startPlayback(uri);
                } else {
                  if (playbackPaused) {
                    resumePlayback();
                  }
                }
              }}
            >
              <FaPlay size={30} />
            </Grid>
          )}
          {playerReady && trackName !== "No Track" && playbackOn && (
            <Grid
              item
              onClick={() => {
                if (!playbackPaused) {
                  pauseTrack();
                }
              }}
            >
              <FaPause size={30} />
            </Grid>
          )}
          {playerReady && trackName !== "No Track" && !uri.includes("track:") && (
            <Grid
              item
              onClick={() => {
                nextTrack();
              }}
            >
              <FaChevronRight size={30} />
            </Grid>
          )}
        </Grid>
      </div>
    </div>
  );
};

export default Player;
