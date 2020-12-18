import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';
import {Button,makeStyles} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
	button: {
	  backgroundColor: "lightgray",
	  textDecoration: "none",
	},
  }));


const Login = (props: any):JSX.Element => {
  const classes=useStyles()
  const [ token, setToken ] = useState(undefined);

  function getHashParams() {
    var hashParams: any = {};
    var e, r = /([^&;=]+)=?([^&;]*)/g,
        q = window.location.hash.substring(1);
    e = r.exec(q)
    while ( e!=null) {
       hashParams[e[1]] = decodeURIComponent(e[2]);
       e = r.exec(q)
    }
    return hashParams;
  }

  const makeRequest = async (tok: string) => {
    try {
      const reqUrl = 'https://api.spotify.com/v1/me';
      const { data } = await axios.get(reqUrl, {
        headers: {
          Authorization: 'Bearer ' + tok 
        }
       });
			return data;
		} catch(e) {
			throw new Error("Request failed");
		}
  }

  useEffect(
    () => {
      async function auth() {
        try {
          let params = getHashParams();
          let access_token = params.access_token;
          props.passBackToken(access_token);
          //let refresh_token = params.refresh_token;

          setToken(access_token);
          await makeRequest(access_token);

        } catch (e) {

        }
      }
      auth();
    },
    [props]
  )
  
	return (
		<div>
      <h1>
        Welcome
      </h1>
      <p>You have been successfully logged in with Spotify, please click the button below to view your playlists.</p>
      <Link className='link' to={{
        pathname: "/playlists/page/1",
        state: [{ token: token}]
      }}>
        <Button className={classes.button}>
          Playlists
          </Button>
      </Link>
      
		</div>
	);
};

export default Login;
