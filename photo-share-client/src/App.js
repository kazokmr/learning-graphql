import React, {Component, Fragment} from "react";
import Users from "./Users";
import {BrowserRouter, Route, Switch} from "react-router-dom";
import {gql} from "apollo-boost";
import AuthorizedUser from "./AuthorizedUser"
import {withApollo} from "react-apollo";

export const ROOT_QUERY = gql`
    query allUsers {
        totalUsers
        allUsers {...userInfo}
        me {...userInfo}
    }

    fragment userInfo on User {
        githubLogin
        name
        avatar
    }
`

const LISTEN_FOR_USERS = gql`
    subscription {
        newUser {
            githubLogin
            name
            avatar
        }
    }
`

class App extends Component {

  componentDidMount() {
    let {client} = this.props
    this.listenForUsers = client
      .subscribe({query: LISTEN_FOR_USERS})
      .subscribe(({data: {newUser}}) => {
        const data = client.cache.readQuery({query: ROOT_QUERY})
        data.totalUsers += 1
        data.allUsers = [
          ...data.allUsers,
          newUser
        ]
        client.cache.writeQuery({query: ROOT_QUERY, data})
      })
  }

  componentWillUnmount() {
    this.listenForUsers.unsubscribe()
  }

  render() {
    return (
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={() =>
            <Fragment>
              <AuthorizedUser/>
              <Users/>
            </Fragment>
          }/>
        </Switch>
      </BrowserRouter>
    )
  }
}

export default withApollo(App)