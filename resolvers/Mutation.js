const {authorizeWithGithub} = require('../lib')

module.exports = {
  async postPhoto(parent, args, {db, currentUser}) {
    if (!currentUser) {
      throw new Error("only an authorized user can post a photo")
    }

    const newPhoto = {
      ...args.input,
      userID: currentUser.githubLogin,
      created: new Date()
    };

    const {insertedIds} = await db.collection("photos").insertOne(newPhoto)
    newPhoto.id = insertedIds

    return newPhoto
  },

  async githubAuth(parent, {code}, {db}) {

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
    })

    if (message) {
      throw new Error(message)
    }

    let latestUserInfo = {
      name,
      githubLogin: login,
      githubToken: access_token,
      avatar: avatar_url
    }

    await db
      .collection('users')
      .replaceOne({githubLogin: login}, latestUserInfo, {upsert: true})

    const user = latestUserInfo
    return {user, token: access_token}
  }
}