const Subscription = {
  newPhoto: {
    subscribe: (parent, args, {pubsub}) =>
      pubsub.asyncIterator('photo-added')
  },
  newUser: {
    subscribe: (parent, args, {pubsub}) =>
      pubsub.asyncIterator('user-added')
  },
};

export default Subscription;
