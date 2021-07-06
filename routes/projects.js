var express = require('express');
const Project  = require('../models/Project')

const auth = require('../middleware/auth')
var router = express.Router();

/************
* Router per gestione progetti civici
* 
*/

/** GET lista tutti progetti civici, eventualmente filtrati per comune
* Non necessario login
*/
router.get('/projectsList',  async function(req, res, next) {
    const progetti = await Project.find()    
    res.send(progetti)
});

/**
 * POST creazione progetto civico
 */
router.post('/', async function(req, res, next) {
    

    const data = new Date(parseInt(req.body.data))
    console.log(data)

    const project = new Project({
        comune: req.body.comune,
        titoloEvento: req.body.titoloEvento,
        descrizione: req.body.descrizione,
        image_url: req.body.image_url ? req.body.image_url : NULL,
        categoria: req.body.categoria,
        civicPoints: req.body.civicPoints,
        data: data
    })
    
    
    console.log(project)

    try {
        await project.save()
        res.status(201).send(project)
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate targa
            return res.status(409).send({ error: 'already exist!' });
        }
        res.status(400).send(err)
    }
});



module.exports = router;
