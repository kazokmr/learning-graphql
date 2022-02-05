import {pubsub} from "../index.js";

const Subscription = {
  newPhoto: {
    subscribe: () =>
      pubsub.asyncIterator('photo-added')
  },
  newUser: {
    subscribe: () =>
      pubsub.asyncIterator('user-added')
  },
};

export default Subscription;
