const firestore = require('../firebase/firebase.js')
const {format} = require('util');
const { Console } = require('console');
const { v4: uuidv4 } = require('uuid');
const path = require('path');


/**
*
* @param { File } object file object that will be uploaded
* @description - This function does the following
* - It uploads a file to the image bucket on Google Cloud
* - It accepts an object as an argument with the
*   "originalname" and "buffer" as keys
*/

const uploadImage = (file) => new Promise((resolve, reject) => {
  const { originalname, buffer } = file
  const extname = path.extname(file.originalname).toLowerCase();
  const storageName = uuidv4() + extname;
  const blob = firestore.bucket.file(storageName)

  const blobStream = blob.createWriteStream({
    resumable: false,
  })

  blobStream.on('finish', async () => {
    const publicUrl = format(`https://storage.googleapis.com/${firestore.bucket.name}/${blob.name}`)
    await makePublic(storageName).catch(console.error);
    await setToken(storageName).catch(console.error);
    resolve(publicUrl)
  }).on('error', () => {
    reject(`Unable to upload image, something went wrong`)    
  }).end(buffer)

})
  
async function makePublic(filename) {
  // Makes the file public
  await firestore.bucket.file(filename).makePublic();
  
  //console.log(`gs://${firestore.bucket.name}/${filename} is now public.`);
}

async function setToken(filename) {
  await firestore.bucket.file(filename).setMetadata({
    metadata: {
      // Update the download token:
      firebaseStorageDownloadTokens: uuidv4(),
    },
  })
}
  

  
module.exports = uploadImage