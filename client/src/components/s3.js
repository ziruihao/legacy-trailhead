import axios from 'axios';
import { checkPropTypes } from 'prop-types';
import { ROOT_URL, BACKEND_URL } from '../constants';

export function getSignedRequest(file) {
  const fileName = encodeURIComponent(file.name);
  // hit our own server to get a signed s3 url
  return axios.get(`${BACKEND_URL}/sign-s3?file-name=${fileName}&file-type=${file.type}`);
}

// return a promise that uploads file directly to S3
// note how we return the passed in url here rather than any return value
// since we already know what the url will be - just not that it has been uploaded
export function uploadFileToS3(signedRequest, file, url) {
  return new Promise((fulfill, reject) => {
    axios.put(signedRequest, file, { headers: { 'Content-Type': file.type } }).then((response) => {
      fulfill(url);
    }).catch((error) => {
      reject(error);
    });
  });
}

export function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  return getSignedRequest(file).then((response) => {
    return uploadFileToS3(response.data.signedRequest, file, response.data.url);
  });
}