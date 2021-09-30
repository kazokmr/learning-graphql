let {_id, photos} = require(`./variables`)

module.exports = {
  postPhoto(parent, args) {
    let newPhoto = {
      id: _id++,
      ...args.input,
      crated: new Date()
    }
    photos.push(newPhoto)
    return newPhoto
  }
}