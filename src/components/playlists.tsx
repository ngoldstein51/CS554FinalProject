import React, { useState, useEffect } from "react";
import axios from "axios";
import { Redirect, Link } from "react-router-dom";
import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Grid,
  Typography,
  makeStyles,
} from "@material-ui/core";
import { Pagination, PaginationItem } from "@material-ui/lab";
import "../App.css";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: "0px",
    margin: '0 auto',
  },
  pagination: {
    display:'flex', 
    justifyContent:'center'
  },
  card: {
    flex: "auto",
    margin: "auto",
    height: 300,
    backgroundColor: "lightgrey",
  },
  text: {
    fontSize: "1rem",
    lineHeight: "1",
  },
  link: {
    color: "black",
    textDecoration: "none",
  },
  page: {
    display: "flex",
    marginLeft: "auto",
    marginRight: "auto",
    paddingBottom: 20,
  },
}));

const Playlists = (props: any) => {
  const [loading, setLoading] = useState<boolean>(true);
  const [playlistData, setPlaylistData] = useState<Array<object>>([]);
  const [pageNum, setPageNum] = useState<number>(1);
  const [totalPlaylists, setTotalPlaylists] = useState<number>(NaN);
  let card: Array<any> = [];
  const classes: any = useStyles();

  const getPlayLists = async (tok: string, pagenum: number) => {
    try {
      const reqUrl = `https://api.spotify.com/v1/me/playlists?limit=20&offset=${
        20 * (pagenum - 1)
      }`;
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
      if (props.location.state !== undefined) {
        setPageNum(props.match.params.pagenum);
        const playlists = await getPlayLists(
          props.location.state[0].token,
          props.match.params.pagenum
        );

        setPlaylistData(playlists.items);
        setTotalPlaylists(playlists.total);

        setLoading(false);
      }
    }
    fetchData();
  }, [props.match.params.pagenum, props.location.state]);

  useEffect(() => {
    console.log('pageNum:', pageNum);
  }, [pageNum]);

  if (props.location.state === undefined) {
    return <Redirect to="/" />;
  }

  const buildCard = (playlist: any) => {
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
        <Card className={classes.card}>
          <Link
            className={classes.link}
            to={{
              pathname: `/playlists/${playlist.id}`,
              state: [{ token: props.location.state[0].token }],
            }}
          >
            <CardActionArea>
              <CardContent>
                <Typography
                  variant="h2"
                  component="h2"
                  className={classes.text}
                >
                  {playlist.name}
                </Typography>
                <Typography
                  variant="body1"
                  className={classes.text}
                  component="p"
                >
                  By: {playlist.owner.display_name}
                </Typography>
                <Typography
                  variant="body2"
                  className={classes.text}
                  component="p"
                >
                  Tracks: {playlist.tracks.total}
                </Typography>
              </CardContent>
              {media}
            </CardActionArea>
          </Link>
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
        <h1>Your Playlists</h1>
        <Pagination
          className={classes.pagination}
          page={pageNum}
          count={Math.ceil(totalPlaylists / 20)}
          variant="outlined"
          color="primary"
          siblingCount={4}
          renderItem={(item) => (
            <PaginationItem
              component={Link}
              to={{
                pathname: `/playlists/page/${item.page}`,
                state: [{ token: props.location.state[0].token }],
              }}
              {...item}
            />
          )}
        />
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
