/*
auth-middleware.js
*/
const firebase = require("../firebase/index");

function authMiddleware(req, res, next) {
    const headerToken = req.headers.authorization;
    if (!headerToken) {
        return res.send({ message: "No token provided" }).status(401);
    }
    
    if (headerToken && headerToken.split(" ")[0] !== "Bearer") {
        res.send({ message: "Invalid token" }).status(401);
    }
    
    const token = headerToken.split(" ")[1];
    firebase
        .auth()
        .verifyIdToken(token)
        .then((decodedToken) => {
            console.log("USER: "),
            console.log(decodedToken),
            req.userId = decodedToken.uid
            req.user = decodedToken
            next()
        })
        .catch(() => res.send({ message: "Could not authorize" }).status(403));
    
   
}

module.exports = authMiddleware;













/*



const { request } = require('express');
const jwt = require('jsonwebtoken')
const User = require('../models/User')

const auth = async(req, res, next) => {
    
    try {
        var token = req.headers.authorization;
        //console.log(token)
        
        const data = jwt.verify(token, process.env.JWT_KEY)
        console.log(data)
        const user = await User.findOne({ _id: data._id })
        if (!user) {
            throw new Error()
        }
        
        req.user = user
        next()
    } catch (error) {
        res.status(401).send({ error: 'Not authorized to access this resource' })
    }
    
}
module.exports = auth



*/