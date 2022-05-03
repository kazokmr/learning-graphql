import React from "react";
import {App} from "./App";
import "./index.css";
import {
  ApolloClient,
  ApolloLink,
  ApolloProvider,
  InMemoryCache,
  split
} from "@apollo/client"
import {WebSocketLink} from "@apollo/client/link/ws";
import {getMainDefinition} from "@apollo/client/utilities";
import {LocalStorageWrapper, persistCache} from "apollo3-cache-persist";
import {createUploadLink} from "apollo-upload-client/public/index";
import {createRoot} from "react-dom/client";

const httpLink = new createUploadLink({uri: 'http://localhost:4000/graphql'});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext(context => ({
    headers: {
      ...context.headers,
      authorization: localStorage.getItem('token')
    }
  }));
  return forward(operation);
});

const httpAuthLink = authLink.concat(httpLink);

const wsLink = new WebSocketLink({
  uri: 'ws://localhost:4000/graphql',
  options: {
    reconnect: true,
  }
});

const splitLink = split(
  ({query}) => {
    const {kind, operation} = getMainDefinition(query)
    return (
      kind === "OperationDefinition" &&
      operation === "subscription"
    );
  },
  wsLink,
  httpAuthLink
);

const cache = new InMemoryCache();

persistCache({
  cache,
  storage: new LocalStorageWrapper(window.localStorage),
});

if (localStorage['apollo-cache-persist']) {
  let cacheData = JSON.parse(localStorage['apollo-cache-persist']);
  cache.restore(cacheData);
}

const client = new ApolloClient({
  link: splitLink,
  cache: cache,
});

const container = document.getElementById("root")
const root = createRoot(container);

root.render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>
);
