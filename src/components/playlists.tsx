import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import "../App.css";
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
}));

const Playlists = (props: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<Array<object>>([]);
  const [pageNum, setPageNum] = useState<number>(NaN);
  let card: Array<any> = [];
  const classes: any = useStyles();

  const getPlayLists = async (tok: string) => {
    try {
      const reqUrl = "https://api.spotify.com/v1/me/playlists";
      const { data } = await axios.get(reqUrl, {
        headers: {
          Authorization: "Bearer " + tok,
        },
      });
      return data;
    } catch (e) {
      throw new Error("Request failed");
    }
  };

  //load
  useEffect((): void => {
    async function fetchData() {
      setLoading(true);
      console.log(props.location.state[0].token);
      const playlists = await getPlayLists(props.location.state[0].token);

      setPlaylistData(playlists.items);
      console.log(playlists.items);
      //Check if pagenum is valid and in bounds, if invalid or out of bounds goto page 0, need api call for bounds
      setPageNum(props.match.params.pagenum);

      setLoading(false);
    }
    fetchData();
  }, [props.match.params.pagenum, props.location.state]);

  //Builds list of playlists
  //TODO: Make prettier, probably put everthing for each playlist into its own rectange with the album cover on the left or something

  const buildCard = (playlist: any) => {
    console.log("playlist:", playlist);
    let media = <div></div>;
    if (playlist.images.length !== 0) {
      media = (
        <CardMedia
          component="img"
          image={playlist.images[0].url}
          title="show image"
        />
      );
    }
    return (
      <Grid item xs={12} sm={6} md={4} lg={4} xl={3} key={playlist.id}>
        <Card className="card">
          <CardActionArea>
            {media}
            <CardContent>
              <Typography variant="h5">
                <h2>{playlist.name}</h2>
              </Typography>
              <Typography variant="body1">
                By: {playlist.owner.display_name}
              </Typography>
              <Typography variant="body2">
                Tracks: {playlist.tracks.total}
              </Typography>
              <Link
                to={{
                  pathname: `/playlists/${playlist.id}`,
                  state: [{ token: props.location.state[0].token }],
                }}
              >
                <button>Listen</button>
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
  //Build list of playlists
  else {
    card =
      playlistData &&
      playlistData.map((playlist) => {
        return buildCard(playlist);
      });
    //TODO: pagination
    return (
      <div className={classes.root}>
        <h1>Playlists Page: {pageNum}</h1>
        <br />
        <br />
        <Grid container spacing={5}>
          {card}
        </Grid>
      </div>
    );
  }
};

export default Playlists;
