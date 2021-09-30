let {photos} = require(`./variables`)

module.exports = {
  totalPhotos: () => photos.length,

  allPhotos: () => photos
}