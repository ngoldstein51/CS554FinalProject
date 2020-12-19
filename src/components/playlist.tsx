import React, { useState, useEffect } from "react";
import axios from "axios";
import { PieChart } from "react-d3-components";
import { Redirect,Link } from "react-router-dom";
import {
  Card,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
  Button,
} from "@material-ui/core";
import { FaPlay } from "react-icons/fa";

interface DataPoint {
  x: any, y: any
}
interface DataSet {
  label: string, values: Array<DataPoint>
}

var data:DataSet = {
  label: 'Popularity',
  values: []
};

var sort: any = null;

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    margin: "auto",
  },
  details: {
    display: "flex",
    flexDirection: "column",
    margin: "auto",
  },
  card: {
    display: "flex",
    flex: "auto",
    width: "100vh",
    margin: "auto",
    maxHeight: 250,
    backgroundColor: "lightgrey",
  },
  cover: {
    height: '100%',
    maxWidth: 250,
  },
  button: {
    marginBottom: '5vh',
  }
}));

function millisToMinutesAndSeconds(millis: number) : string {
  var minutes: number = Math.floor(millis / 60000);
  var seconds: string = ((millis % 60000) / 1000).toFixed(0);
  return minutes + ":" + (parseInt(seconds) < 10 ? '0' : '') + seconds;
}

const Playlist = (props: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<any>([]);
  const classes = useStyles();
  let card: Array<any> = [];
  //load
  useEffect((): void => {
    async function fetchData() {
      setLoading(true);
      if(props.location.state!==undefined){
      const playlistResp = await axios.get(
        "https://cs554-final.herokuapp.com/spotify-playlist?tok=" +
          props.location.state[0].token +
          "&id=" +
          props.match.params.id
      );
      const playlist = playlistResp["data"];

      console.log(playlist);

      let artists: { [x: string]: number; } = {};
      
      data.values = [];

      for(let i=0;i<playlist["tracks"]["items"].length;i++){
        let name = playlist["tracks"]["items"][i]["track"]["artists"][0]["name"];
        if (name in artists){
          artists[name] += 1;
        } else {
          artists[name] = 1;
        }
      }
      for (let i = 0; i < Object.keys(artists).length;i++){
        data.values.push({ x: Object.keys(artists)[i], y: artists[Object.keys(artists)[i]] });
      }
      setPlaylistData(playlist);
    }
      setLoading(false);
    }
    fetchData();
  }, [props.match.params.id, props.location.state]);

  if(props.location.state===undefined){
		return(
			<Redirect to="/"/>
		)
	}


  const buildCard = (song: any, index: number, playlist: string) => {
    return (
      <Grid item xs={12} key={song.track.id}>
        <Card className={classes.card}>
          <CardMedia
            className={classes.cover}
            component="img"
            image={song.track.album.images[0].url}
            title="Album image"
          />
          <div className={classes.details}>
            <CardContent>
              <Typography component="h5" variant="h5">
                {song.track.name}
              </Typography>
              <Typography variant="body1">
                By: {song.track.artists[0].name}
              </Typography>
              <Typography variant="body2">
                Length: {millisToMinutesAndSeconds(song.track.duration_ms)}
              </Typography>
              <Link
                to={{
                  pathname: `/songs/${song.track.id}`,
                  state: [{ token: props.location.state[0].token }],
                }}
              >
                <Button variant="contained" className={classes.button}>More Info</Button>
              </Link>
              <div
                onClick={() => {
                  props.setURI(playlist);
                  props.setOffset(index);
                }}
              >
                <FaPlay size={30} color={'#3f51b5'}/>
              </div>
            </CardContent>
          </div>
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
  else {
    const tracks: Array<any> = playlistData["tracks"]["items"];
    card =
      tracks &&
      tracks.map((song, index) => {
        return buildCard(song, index, playlistData["uri"]);
      });
    //TODO: pagination

    return (
      <div className={classes.root}>
        <h1>{playlistData["name"]}</h1>

        <br />
        <br />
        <h2>Artist Breakdown</h2>
        <PieChart
          data={data}
          width={1000}
          height={400}
          margin={{ top: 10, bottom: 10, left: 100, right: 100 }}
          sort={sort}
        />
        <Grid container spacing={10}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default Playlist;
