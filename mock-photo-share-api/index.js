const {ApolloServer} = require("apollo-server")
const {readFileSync} = require("fs")
const {casual} = require('casual')

const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8')
const resolvers = {}

const mocks = {
  Query: () => ({
    totalPhotos: () => 42,
    allPhotos: [...new Array(casual.photo(5, 10))],
    Photo: () => ({
      name: 'sample photo',
      description: null
    })
  })
}

const server = new ApolloServer({typeDefs, resolvers, mocks})

server.listen({port: 4000}).then(({url}) => {
  console.log(`Mock Photo Share GraphQL Server ready at ${url}`)
})
