import ApolloClient, {gql} from "apollo-boost";
import {render} from "react-dom";
import {ApolloProvider} from "react-apollo";
import App from "./App";

const client = new ApolloClient({uri: 'http://localhost:4000/graphql'})

render(
  <ApolloProvider client={client}>
    <App/>
  </ApolloProvider>,
  document.getElementById('root')
)

const query = gql`
    {
        totalUsers
        totalPhotos
    }
`

console.log("cache", client.extract())
client.query({query})
  .then(() => console.log("cache", client.extract()))
  .catch(console.error)