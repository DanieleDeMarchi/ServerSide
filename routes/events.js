var express = require('express');
const Event = require('../models/Event')

const auth = require('../middleware/auth')
var router = express.Router();

/************
* Router per gestione eventi
* 
*/

/** GET lista tutti eventi, eventualmente filtrati per comune
* Non necessario login
*/
router.get('/eventList/:comune',  async function(req, res, next) {
    var eventi = null
    if(req.params.comune){
        eventi = await Event.findAll({comune: req.params.comune})
    }
    else{
        eventi = await Event.findAll({})
    }
    
    res.send(eventi)  
});


/** GET dettaglio evento  
* Non necessario login
*/
router.get('/:eventId', async function(req, res, next) {
    const _id = req.params.eventId
    
    try {
        const evento = await Event.findOne({ _id })    
        if (!evento) {
            return res.status(404).send()
        }
        res.send(evento)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
});



/** ADD Event
*  Solo utente "organizzazione"
*/
router.post('/', auth, async function(req, res, next) {
    
    if(req.user.ruolo != "organizzatore" ){
        res.status(401).send({error: 'Utente non organizzatore'})
        next();
    }
    const evento = new Evento({
        ...req.body,    //copia tutto req.body
        organizzatore: req.user._id //aggiungi proprietario
    })
    
    console.log(evento)
    
    try {
        await evento.save()
        res.status(201).send(evento)
    } catch (err) {
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate targa
            return res.status(409).send({ error: 'already exist!' });
        }
        res.status(400).send(err)
    }
    
});


/** DELETE Event
*  Solo utente "organizzazione"
*/
router.delete('/:eventId', auth, async function(req, res, next) {

    if(req.user.ruolo != "organizzatore" ){
        res.status(401).send({error: 'Utente non organizzatore'})
        next();
    }

    const evento = await Event.findOne({ _id: req.params.eventId, organizzatore: req.user._id })    
    if (!evento) {
        return res.status(404).send()
    }
    
    Evento.findByIdAndRemove(req.params.eventId, async function (err, deleted) { 
        if (err){ 
            res.status(500).send(err) 
        } 
        else{ 
            res.status(200).send({deletedCar: deleted}) 
        } 
    });
});

module.exports = router;
