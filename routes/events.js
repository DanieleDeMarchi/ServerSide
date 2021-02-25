var express = require('express');
const Event = require('../models/Event')
const auth = require('../middleware/auth')
const fileUploader = require ('../helpers/file_uploader')
const multerImage = require ('../helpers/multer_image')
var router = express.Router();


/************
* Router per gestione eventi
* 
*/

/** GET lista tutti eventi, eventualmente filtrati per comune
* Non necessario login
*/
router.get('/eventList',  async function(req, res, next) {
    const eventi = await Event.find()    
    res.send(eventi)
});


/** GET lista tutti eventi, eventualmente filtrati per comune
* Non necessario login
*/
router.get('/eventList/:page',  async function(req, res, next) {
    const per_page = parseInt (req.query.per_page ? req.query.per_page : 10 );
    const page = req.params.page || 1; // Page

    try {
        const eventi = await Event.find()
            .skip((per_page * page) - per_page)
            .limit(per_page);

        res.send(eventi)
    }
    catch (e) {
        console.log(e)
        res.status(500).send()
    }
    
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
*  Solo utente "organizzazione" (vincolo tolto per il momento)
*/
router.post('/', async function(req, res, next) {
    
    /*
    if(req.user.ruolo != "organizzatore" ){
        res.status(401).send({error: 'Utente non organizzatore'})
        next();
    }
    
    
    const evento = new Evento({
        ...req.body,    //copia tutto req.body
        organizzatore: req.user._id //aggiungi proprietario
    })
    */
    const data = new Date(parseInt(req.body.data))
    console.log(data)

    const evento = new Event({
        comune: req.body.comune,
        indirizzo: req.body.indirizzo,
        titoloEvento: req.body.titoloEvento,
        descrizione: req.body.descrizione,
        info_url: req.body.info_url ? req.body.info_url : NULL,
        image_url: req.body.image_url ? req.body.image_url : NULL,
        categoria: req.body.categoria,
        data: data
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

const test = async(req, res, next) => {
    console.log("test"); 
    next()
}
/** ADD event image from file upload
*  Solo utente "organizzazione" (vincolo tolto per il momento)
*/
router.post('/upload/eventImage', multerImage.single('eventImage'), async function(req, res, next) {

    if(!req.file) {
        res.status(400).send("Error: No files found")
    } else {
        console.log(req.file)
        try {
            const myFile = req.file
            const imageUrl = await fileUploader(myFile)
            res
              .status(200)
              .json({
                message: "Upload was successful",
                data: imageUrl
              })
        } catch (error) {
                console.log(error)
                next(error)
        }
    }
});



/** DELETE Event
*  Solo utente "organizzazione"  (vincolo tolto per il momento)
*/
router.delete('/:eventId', async function(req, res, next) {
    
    
    /*
    if(req.user.ruolo != "organizzatore" ){
        res.status(401).send({error: 'Utente non organizzatore'})
        next();
    }
    */
    
    const evento = await Event.findOne({ _id: req.params.eventId })    
    if (!evento) {
        return res.status(404).send()
    }
    
    Event.findByIdAndRemove(req.params.eventId, async function (err, deleted) { 
        if (err){ 
            res.status(500).send(err) 
        } 
        else{ 
            res.status(200).send({deleted}) 
        } 
    });
});


const toDate = (dateStr) => {
    const [year, month, day] = dateStr.split("-")
    console.log(year, month - 1, day)
    const date = new Date(year, month - 1 , day)
    const userTimezoneOffset = date.getTimezoneOffset() * 60000;
    return new Date(date - userTimezoneOffset);
}


module.exports = router;
