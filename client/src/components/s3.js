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
    const saveHeader = axios.defaults.headers.common.Authorization;
    delete axios.defaults.headers.common.Authorization;
    axios.put(signedRequest, file, { headers: { 'Content-Type': file.type } }).then((response) => {
      axios.defaults.headers.common.Authorization = saveHeader;
      console.log(saveHeader);
      fulfill(url);
    }).catch((error) => {
      console.log(error.message);
      axios.defaults.headers.common.Authorization = saveHeader;
      reject(error);
    }).finally(() => {
      axios.defaults.headers.common.Authorization = saveHeader;
    });
  });
}

export function uploadImage(file) {
  // returns a promise so you can handle error and completion in your component
  return getSignedRequest(file).then((response) => {
    console.log(response.data.url);
    return uploadFileToS3(response.data.signedRequest, file, response.data.url);
  });
}
