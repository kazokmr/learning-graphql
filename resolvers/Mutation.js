const {authorizeWithGithub} = require('../lib')
let {_id, photos} = require('./variables')

module.exports = {
  postPhoto(parent, args) {
    let newPhoto = {
      id: _id++,
      ...args.input,
      crated: new Date()
    }
    photos.push(newPhoto)
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