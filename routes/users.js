const express = require('express')
const User = require('../models/User')
const auth = require('../middleware/auth')
const router = express.Router()

/************
 * Router per gestione utenti
 * 
 */

/*logged user info*/
router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send({ "user": req.user})
});


module.exports = router;