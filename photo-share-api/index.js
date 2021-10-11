const express = require('express')
const expressPlayground = require('graphql-playground-middleware-express').default
const {createServer} = require('http')
const {ApolloServer, PubSub} = require('apollo-server-express')
const {MongoClient} = require('mongodb')
const {readFileSync} = require('fs')
const resolvers = require('./resolvers')
const path = require("path");
const depthLimit = require("graphql-depth-limit");
const {createComplexityLimitRule} = require("graphql-validation-complexity");

require('dotenv').config()
const typeDefs = readFileSync('./typeDefs.graphql', 'UTF-8');

async function start() {

  const app = express()
  const pubsub = new PubSub()
  const MONGO_DB = process.env.DB_HOST
  const client = await MongoClient.connect(MONGO_DB, {useNewUrlParser: true})
  const db = client.db()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    engine: true,
    validationRules: [
      depthLimit(5),
      createComplexityLimitRule(1000, {
        onCost: cost => console.log('query cost: ', cost)
      })
    ],
    context: async ({req, connection}) => {
      const githubToken = req ? req.headers.authorization : connection.context.Authorization
      const currentUser = await db.collection('users').findOne({githubToken})
      return {db, currentUser, pubsub}
    }
  })

  server.applyMiddleware({app})

  app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`))

  app.get('/playground', expressPlayground({endpoint: '/graphql'}))

  app.use(
    'img/photos',
    express.static(path.join(__dirname, 'assets', 'photos'))
  )

  const httpServer = createServer(app)
  server.installSubscriptionHandlers(httpServer)

  httpServer.timeout = 5000

  httpServer.listen({port: 4000}, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  )
}

start()
