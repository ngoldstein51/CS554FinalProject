import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../App.css';
import { Link } from 'react-router-dom';
import { access } from 'fs';

// interface Spotify {
//   display_name: string,
//   id: string,
//   email: string,
//   external_urls: any,
//   href: string,
//   images: any,
//   country: string
// }

const Login = (props: any):JSX.Element => {
  const [ token, setToken ] = useState(undefined);
  const [ exResp, setExResp ] = useState(undefined);

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
          console.log(params);
          let access_token = params.access_token;
          props.passBackToken(access_token);
          //let refresh_token = params.refresh_token;

          setToken(access_token);
          let resp = await makeRequest(access_token);

          setExResp(resp);

        } catch (e) {

        }
      }
      auth();
    },
    []
  )
  //let noBody = 'Goodbye!';
  console.log(exResp);
  
	return (
		<div>
      <h1>
        Login Page
      </h1>

      <Link className='link' to='/login'>
        Home
      </Link>
      <Link className='link' to={{
        pathname: "/playlists",
        state: [{ token: token}]
      }}>
        Playlists
      </Link>
      

      {/* {exResp !== undefined && token !== undefined ? 
      <div>
         <dl>
            <dt>Display name</dt><dd>{exResp1.display_name}</dd>
            <dt>Id</dt><dd>{exResp.id}</dd>
            <dt>Email</dt><dd>{exResp.email}</dd>
            <dt>Spotify URI</dt><dd><a href={exResp.external_urls.spotify}>{exResp.external_urls.spotify}</a></dd>
            <dt>Link</dt><dd><a href={exResp.href}>{exResp.href}</a></dd>
            <dt>Profile Image</dt><dd><a href={exResp.images[0].url}>{exResp.images[0].url}</a></dd>
            <dt>Country</dt><dd>{exResp.country}</dd>
          </dl>
      </div>
      : noBody} */}
		</div>
	);
};

export default Login;
