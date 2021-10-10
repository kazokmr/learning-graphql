import React from "react";
import {render} from "react-dom";
import App from "./App";
import {ApolloProvider} from "react-apollo";
import {persistCache} from "apollo3-cache-persist";
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
  split
} from "apollo-boost";
import {WebSocketLink} from "apollo-link-ws";
import {getMainDefinition} from "apollo-utilities";

const cache = new InMemoryCache()
persistCache({
  cache,
  storage: localStorage
})

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist'])
  cache.restore(cacheData)
}

const httpLink = new HttpLink({uri: 'http://localhost:4000/graphql'})
const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {reconnect: true}
})

const authLink = new ApolloLink(((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem('token')
    }
  }))
  return forward(operation)
}))

const httpAuthLink = authLink.concat(httpLink)

const link = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query)
    return kind === 'OperationDefinition' && operation === 'subscription'
  },
  wsLink,
  httpAuthLink
)

const client = new ApolloClient({cache, link})

render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
)
