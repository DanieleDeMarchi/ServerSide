/*
MIDDLEWARE per autenticazione
auth-middleware.js
Controlla l'authorization header
Se non presente continua comunque l'esecuzione.
Da usare quando la richiesta può essere fatta sia da utenti autenticati che non.
*/
const firebase = require("../db/firebase");

function authMiddleware(req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        req.user = null
        return next()
    }
    
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
        res.send({ message: "Invalid token" }).status(401);
    }
    
    const token = headerToken.split(" ")[1];
    //console.log(token)
    firebase
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log("USER: "),
            console.log(decodedToken.email),
            req.userId = decodedToken.uid
            req.user = decodedToken
            next()
        })
        .catch(() => {
            req.user = null
            next()
        });
    
   
}

module.exports = authMiddleware;