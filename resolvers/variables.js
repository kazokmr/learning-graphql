let _id = 0

let users = [
  {"githubLogin": "mHattrup", "name": "Mike Hattrup"},
  {"githubLogin": "gPlake", "name": "Glen Plake"},
  {"githubLogin": "sSchmidt", "name": "Scot Schmidt"}
]

let tags = [
  {"photoID": "1", "userID": "gPlake"},
  {"photoID": "2", "userID": "sSchmidt"},
  {"photoID": "2", "userID": "mHattrup"},
  {"photoID": "2", "userID": "gPlake"},
]

let photos = [
  {
    "id": "1",
    "name": "Dropping the Heart Chute",
    "description": "The heart chute is one of my favorite chutes",
    "category": "ACTION",
    "githubUser": "gPlake",
    "created": "3-28-1977"
  },
  {
    "id": "2",
    "name": "Enjoying the sunshine",
    "category": "SELFIE",
    "githubUser": "sSchmidt",
    "created": "1-2-1985"
  },
  {
    "id": "3",
    "name": "Gunbarrel 25",
    "description": "25 laps on gunbarrel today",
    "category": "LANDSCAPE",
    "githubUser": "sSchmidt",
    "created": "2018-04-15T19:09:57.308Z"
  }
]

const variables = {
  _id,
  users,
  tags,
  photos
}

module.exports = variables
