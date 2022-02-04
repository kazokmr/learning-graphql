import {ObjectId} from "mongodb";

const Query = {

  me: (parent, args, {currentUser}) => currentUser,

  totalPhotos: (parent, args, {db}) =>
    db.collection('photos')
      .estimatedDocumentCount(),

  // TODO: パラメータafterに対応するfilterが無い
  allPhotos: (parent, args, {db}) =>
    db.collection('photos')
      .find()
      .toArray(),

  Photo: (parent, args, {db}) =>
    db.collection('photos')
      .findOne({_id: ObjectId(args.id)}),

  totalUsers: (parent, args, {db}) =>
    db.collection('users')
      .estimatedDocumentCount(),

  allUsers: (parent, args, {db}) =>
    db.collection('users')
      .find()
      .toArray(),

  User: (parent, args, {db}) =>
    db.collection('users')
      .findOne({githubLogin: args.login}),
};

export default Query;
