/**
 * Connessione ai servizi FIREBASE
 * DEVONO ESSERE PRESENTE LE CHIAVI DI CONNESSIONE NELLE VARIABILI D'AMBIENTE
 */

const firebase = require("firebase-admin");
require('dotenv').config();


firebase.initializeApp({
  credential: firebase.credential.cert({
    "projectId": process.env.FIREBASE_PROJECT_ID,
    "private_key": process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.FIREBASE_CLIENT_EMAIL,
  }),
  databaseURL: "https://civic-points.firebaseio.com",
});

module.exports = firebase;