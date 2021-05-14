/*
auth-middleware.js
*/
const firebase = require("../db/firebase");

function authMiddleware(req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        return res.send({ message: "No token provided" }).status(401);
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
            //console.log("USER: "),
            //console.log(decodedToken),
            req.userId = decodedToken.uid
            req.user = decodedToken
            next()
        })
        .catch(() => res.send({ message: "Could not authorize" }).status(403));
    
   
}

module.exports = authMiddleware;