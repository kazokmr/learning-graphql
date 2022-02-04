import Query from "./Query.js";
import Mutation from "./Mutation.js"
import Subscription from "./Subscription.js"
import Type from "./Type.js"

const resolvers = {
  Query,
  Mutation,
  Subscription,
  ...Type
}

export default resolvers;