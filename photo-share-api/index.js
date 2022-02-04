import {createServer} from "http";
import {execute, subscribe} from "graphql";
import {SubscriptionServer} from "subscriptions-transport-ws";
import express from "express";
import {ApolloServer} from "apollo-server-express";
import resolvers from "./resolvers/index.js";
import {readFileSync} from "fs";
import depthLimit from "graphql-depth-limit";
import {createComplexityLimitRule} from "graphql-validation-complexity";
import {PubSub} from "graphql-subscriptions";
import {MongoClient} from "mongodb";
import {makeExecutableSchema} from "@graphql-tools/schema";
import {
  ApolloServerPluginLandingPageGraphQLPlayground
} from "apollo-server-core";
import path from "path";
import dotenv from "dotenv";
import {graphqlUploadExpress} from "graphql-upload/public/index.js";

dotenv.config();
const typeDefs = readFileSync(`./typeDefs.graphql`, `UTF-8`);

(async function () {

  const app = express();
  app.use(graphqlUploadExpress());
  const httpServer = createServer(app);

  const schema = makeExecutableSchema({typeDefs, resolvers});

  const subscriptionServer = SubscriptionServer.create(
    {schema, execute, subscribe},
    {server: httpServer, path: "/graphql"}
  );

  const MONGO_DB = process.env.DB_HOST;
  const client = await MongoClient.connect(MONGO_DB, {useNewUrlParser: true});
  const db = client.db();
  const pubsub = new PubSub();

  const server = new ApolloServer({
    schema,
    plugins: [{
      async serverWillStart() {
        return {
          async drainServer() {
            subscriptionServer.close();
          }
        };
      },
    },
      ApolloServerPluginLandingPageGraphQLPlayground()
    ],
    engine: true,
    validationRules: [
      depthLimit(5),
      createComplexityLimitRule(1000, {
        onCost: cost => console.log('query cost: ', cost)
      })
    ],
    context: async ({req, connection}) => {
      const githubToken = req ? req.headers.authorization : connection.context.Authorization;
      const currentUser = await db.collection('users').findOne({githubToken});
      return {db, currentUser, pubsub};
    },
  });
  await server.start();
  server.applyMiddleware({app});

  app.get('/', (req, res) => res.end(`Welcome to the PhotoShare API`));

  const __dirname = new URL(import.meta.url).pathname;
  app.use('img/photos', express.static(path.join(__dirname, 'assets', 'photos')));

  httpServer.timeout = 5000;
  httpServer.listen({port: 4000}, () =>
    console.log(`GraphQL Server running @ http://localhost:4000${server.graphqlPath}`)
  );
})();
