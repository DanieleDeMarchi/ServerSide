const admin = require("firebase-admin");

// FIXME: Modificare .env file includendo dati account firebase
// Rimuovere serviceAccountKey.json

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://civic-points-default-rtdb.europe-west1.firebasedatabase.app",
  storageBucket: "civic-points.appspot.com"
});

// Cloud storage
const bucket = admin.storage().bucket('civic-points.appspot.com')

module.exports = {
  bucket
}
