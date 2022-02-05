import {authorizeWithGithub, uploadStream} from "../lib.js";
import fetch from "node-fetch";
import {ObjectId} from "mongodb";
import path from "path";

const Mutation = {

  async postPhoto(root, args, {db, currentUser, pubsub}) {
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo");
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    };

    const {insertedId} = await db.collection("photos").insertOne(newPhoto);
    newPhoto.id = insertedId;

    let toPath = path.join(
      __dirname, '..', 'assets', 'photos', '${newPhoto.id}.jpg'
    );

    const {createReadStream,filename,mimetype,encoding} = await args.input.file;
    const stream = createReadStream();
    await uploadStream(stream, toPath);

    await pubsub.publish('photo-added', {newPhoto})

    return newPhoto;
  },

  async tagPhoto(parent, args, {db}) {

    await db.collection('tags')
      .replaceOne(args, args, {upsert: true});

    return db.collection('photos')
      .findOne({_id: ObjectId(args.photoID)});
  },

  async githubAuth(parent, {code}, {db, pubsub}) {

    let {
      message,
      access_token,
      avatar_url,
      login,
      name
    } = await authorizeWithGithub({
      client_id: process.env.CLIENT_ID,
      client_secret: process.env.CLIENT_SECRET,
      code
    });

    if (message) {
      throw new Error(message);
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    };

    await db
      .collection('users')
      .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true});

    const user = latestUserInfo;
    await pubsub.publish('user-added', {newUser: user});

    return {user, token: access_token};
  },

  addFakeUsers: async (root, {count}, {db, pubsub}) => {

    let randomUserApi = `https://randomuser.me/api/?results=${count}`;

    let {results} = await fetch(randomUserApi).then(res => res.json());

    let users = results.map(r => ({
      githubLogin: r.login.username,
      name: `${r.name.first} ${r.name.last}`,
      avatar: r.picture.thumbnail,
      githubToken: r.login.sha1
    }));

    await db.collection("users").insertMany(users);

    let newUsers = await db.collection('users')
      .find()
      .sort({_id: -1})
      .limit(count)
      .toArray();

    newUsers.forEach(newUser => pubsub.publish('user-added', {newUser}));

    return users;
  },

  async fakeUserAuth(parent, {githubLogin}, {db}) {

    let user = await db.collection("users").findOne({githubLogin});

    if (!user) {
      throw new Error(`Cannot find user with githubLogin ${githubLogin}`);
    }

    return {
      token: user.githubToken,
      user
    };
  },

};

export default Mutation;
