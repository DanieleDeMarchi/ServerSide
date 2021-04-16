var express = require('express');
const Event = require('../models/Event')
var createError = require('http-errors');

const auth = require('../middleware/auth')
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



/* SEARCH */
/* url/events/search?title=titoloRicercato&
         category[]=categoria+1&
         category[]=categoria2+2&
         date_from=isoTimestamp&
         date_to=isoTimestamp&
         comune=comune 
*
*/

router.get('/search',  async function(req, res, next) {
    console.log(req.query)

    if(!req.query.title){
        return next(createError(401));
    }

    const query = Event.aggregate([{
        $search:{
            text: {
                query: req.query.title,
                path: ['titoloEvento', 'descrizione'],
                fuzzy: {
                    "maxEdits": 2,
                    "maxExpansions": 100,
                }
            }
        }        
    }])

    additionalFilters = {}

    if(req.query.comune){
        additionalFilters["comune"] = req.query.comune
    }
    if(req.query.category){
        additionalFilters["categoria"] = { $in: req.query.category}
    }

    if(req.query.date_to){
        const dataFine = new Date(req.query.date_to)
        if(isNaN(dataFine)) return next(createError(401, "Invalid date format"))

        additionalFilters["data"] = {};
        additionalFilters["data"]["$lte"] = dataFine 
    }
    if(req.query.date_from){
        const dataInizio = new Date(req.query.date_from)
        if(isNaN(dataInizio)) return next(createError(401, "Invalid date format"))

        if (!additionalFilters["data"]) additionalFilters["data"] = {};
        additionalFilters["data"]["$gte"] = dataInizio
    }

    console.log(additionalFilters)

    query.append({
        $match:additionalFilters
    })
        
    try {
        const eventi = await query.exec()
        res.send(eventi)
    } catch (error) {
        next(createError(500, error))
    }        
});




/** GET lista tutti eventi, eventualmente filtrati per comune
* Non necessario login
*
* indirizzoheroku/events/eventList/5?per_page=10 
* Server side pagination */
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
