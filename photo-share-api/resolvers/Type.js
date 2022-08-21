import {GraphQLScalarType} from "graphql";
import {ObjectId} from "mongodb";
import GraphQLUpload from "graphql-upload/GraphQLUpload.mjs";

const Type = {

  Photo: {
    id: parent => parent.id || parent._id,

    url: parent => `/img/photos/${parent._id}.jpg`,

    postedBy: (parent, args, {db}) =>
      db.collection("users")
        .findOne({githubLogin: parent.userID}),

    taggedUsers: async (parent, args, {db}) => {
      const tags = await db.collection('tags')
        .find({photoID: parent._id.toString()})
        .toArray();

      const logins = tags.map(t => t.githubLogin);

      return db.collection('users')
        .find({githubLogin: {$in: logins}})
        .toArray();
    },

  },

  User: {
    postedPhotos: (parent, args, {db}) =>
      db.collection("photos")
        .find({userID: parent.githubLogin})
        .toArray(),

    inPhotos: async (parent, args, {db}) => {
      const tags = await db.collection('tags')
        .find({githubLogin: parent.githubLogin})
        .toArray();

      const photoIDs = tags.map(t => ObjectId(t.photoID));

      return db.collection('photos')
        .find({_id: {$in: photoIDs}})
        .toArray();
    },

  },

  DateTime: new GraphQLScalarType({
    name: 'DateTime',
    description: 'A valid date time value.',
    parseValue: value => new Date(value),
    serialize: value => new Date(value).toISOString(),
    parseLiteral: ast => ast.value
  }),

  Upload: GraphQLUpload,

};

export default Type;