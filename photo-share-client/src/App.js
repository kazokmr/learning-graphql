import React, {Fragment} from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";
import {gql, useSubscription} from "@apollo/client"
import {AuthorizedUser} from "./AuthorizedUser"
import {Users} from "./Users";
import {Photos} from "./Photos";
import {PostPhoto} from "./PostPhoto";

export const ROOT_QUERY = gql`
    query allUsers {
        totalUsers
        totalPhotos
        allUsers {...userInfo}
        me {...userInfo}
        allPhotos{
            id
            name
            url
        }
    }

    fragment userInfo on User {
        githubLogin
        name
        avatar
    }
`;

const LISTEN_FOR_USERS = gql`
    subscription {
        newUser {
            githubLogin
            name
            avatar
        }
    }
`;

export const App = () => {

  useSubscription(LISTEN_FOR_USERS, {
    onSubscriptionData: ({client, subscriptionData}) => {
      const newUser = subscriptionData.data.newUser;
      const users = client.readQuery({query: ROOT_QUERY});
      // users ObjectのPropertyがReadOnlyになる
      // またApolloClientの既知のIssueがある。 https://github.com/apollographql/apollo-client/issues/8677
      client.writeQuery({query: ROOT_QUERY}, {
        ...users,
        totalUsers: users.totalUsers + 1,
        allUsers: [...users.allUsers, newUser],
      });
    }
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <Fragment>
            <AuthorizedUser/>
            <Users/>
            <Photos/>
          </Fragment>
        }
        />
        <Route path="/newPhoto" element={<PostPhoto/>}/>
        <Route path="*" element={({location}) =>
          <h1>"{location.pathname}" not found</h1>
        }
        />
      </Routes>
    </BrowserRouter>
  );
}
