/**
 * Router gestione COMUNI
 */
var express = require('express');
const Comune = require('../models/Comune')

const auth = require('../middleware/auth')
var router = express.Router();

/**
 * POST: crea un comune
 */
router.post('/', async function(req, res, next) {

    const comune = new Comune({
        nomeComune: req.body.nomeComune,
        enabled: true,
        categorieDisponibili: req.body.categorieRichieste
    })
    
    
    console.log(comune)
    
    try {
        await comune.save()
        res.status(201).send(comune)
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate targa
            return res.status(409).send({ error: 'already exist!' });
        }
        res.status(400).send(err)
    }
});


module.exports = router;