/*
auth-middleware.js
*/
const firebase = require("../db/firebase");

function authMiddleware(req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        return res.status(401).send({ message: "No token provided" });
    }
    
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
        res.status(401).send({ message: "Invalid token" });
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
        .catch(() => res.status(403).send({ message: "Could not authorize" }));
    
   
}

module.exports = authMiddleware;