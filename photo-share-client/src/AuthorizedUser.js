import React, {useEffect, useState} from "react";
import {NavLink, useNavigate, useLocation} from "react-router-dom"
import {gql, useApolloClient, useMutation, useQuery} from "@apollo/client";
import {ROOT_QUERY} from "./App";

const GITHUB_AUTH_MUTATION = gql`
    mutation githubAuth($code:String!){
        githubAuth(code: $code){token}
    }
`;

const Me = ({logout, requestCode, signingIn}) => {

  const {data, loading, error} = useQuery(ROOT_QUERY, {
    fetchPolicy: "cache-only",
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>`Error! ${error.message}`</p>;

  return (
    data?.me ?
      <CurrentUser {...data.me} logout={logout}/> :
      <button
        onClick={requestCode}
        disabled={signingIn}
      >Githubへサインイン</button>
  );
}

const CurrentUser = ({name, avatar, logout}) =>
  <div>
    <img src={avatar} width={48} height={48} alt=""/>
    <h1>{name}</h1>
    <button onClick={logout}>logout</button>
    <NavLink to="/newPhoto">写真を投稿する</NavLink>
  </div>;

export const AuthorizedUser = () => {

  const [signingIn, setSigningIn] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const client = useApolloClient();

  const authorizationComplete = (cache, {data: {githubAuth: {token}}}) => {
    console.log(`token: ${token}`)
    localStorage.setItem("token", token);
    navigate("/", {replace: true});
    setSigningIn(false);
  }

  const [gitHubAuthMutation, {
    loading,
    error
  }] = useMutation(GITHUB_AUTH_MUTATION, {
    variables: {code: ""},
    update(cache, data) {
      authorizationComplete(cache, data);
    },
    refetchQueries: [{query: ROOT_QUERY}]
  });

  useEffect(() => {
    if (location.search.match(/code=/)) {
      setSigningIn(true);
      const code = location.search.replace("?code=", "");
      gitHubAuthMutation({variables: {code}});
    }
  }, []);

  if (loading) return "Loading...";
  if (error) return `Error ${error.message}`;

  const requestCode = () => {
    let clientId = process.env.REACT_APP_CLIENT_ID;
    window.location = `https://github.com/login/oauth/authorize?client_id=${clientId}&scope=user`
  };

  const logout = () => {
    localStorage.removeItem("token");
    let data = client.readQuery({query: ROOT_QUERY});
    data = {
      ...data,
      me: null
    };
    client.writeQuery({query: ROOT_QUERY, data});
  }

  return (
    <Me
      signingIn={signingIn}
      requestCode={requestCode}
      logout={logout}
    />
  );
}
