import fetch from "node-fetch";
import * as fs from "fs";

const requestGithubToken = credentials =>
  fetch(
    'https://github.com/login/oauth/access_token',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify(credentials)
    }
  )
    .then(res => res.json())
    .catch(error => {
      throw new Error(JSON.stringify(error))
    });

const requestGithubUserAccount = token =>
  fetch('https://api.github.com/user',
    {
      headers: {
        Authorization: `token ${token}`
      }
    }
  ).then(res => res.json());

export const authorizeWithGithub = async credentials => {
  const {access_token} = await requestGithubToken(credentials);
  const githubUser = await requestGithubUserAccount(access_token);
  return {...githubUser, access_token};
}

export const uploadStream = (stream, path) =>
  new Promise((resolve, reject) => {
    stream?.on('error', error => {
      if (stream.truncated) {
        fs.unlinkSync(path);
      }
      reject(error);
    })?.on('end', resolve)
      .pipe(fs.createWriteStream(path));
  });
