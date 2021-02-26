const firebase = require("firebase-admin");

const credentials = require("./serviceAccountKey.json");

firebase.initializeApp({
  credential: firebase.credential.cert(credentials),
  databaseURL: "https://civic-points.firebaseio.com",
});

module.exports = firebase;