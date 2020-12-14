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