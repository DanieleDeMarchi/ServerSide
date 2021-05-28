const express = require('express')
const User = require('../models/User')
const Comune = require('../models/Comune')
const RichiestaRuolo = require('../models/RichiestaRuolo')
const auth = require('../middleware/auth')
const authFacoltativa = require('../middleware/authNonObbligatoria')
const router = express.Router()

/************
 * Router per gestione RUOLI utenti
 * 
 */

 router.get('/getAll', async(req, res, next)  => {
    const richiesteRuolo = await RichiestaRuolo.find().populate('richiedente').populate('comuneDaAmministrare')    
    res.send(richiesteRuolo)

})

router.get('/listaSindaci', async(req, res, next)  => {
    const comuni = await Comune.find({sindaco: {$ne: null} }).populate('sindaco')
    res.send(comuni)

})





 router.post('/richiediRuoloSindaco', auth, async(req, res, next) => {
    // View logged in user profile
    let user = await User.findOne({ uid: req.user.uid })

    if(!user){
        user = new User({
            "uid": req.user.uid,
            "ruolo": "cittadino",
            "comuneDiResidenza": null,
            "comuniDiInteresse": []
        })

        try {
            await user.save()
        } catch (err) {
            //console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate 
                return res.status(409).send({ error: 'already exist!' });
            }
            return res.status(400).send(err)
        }        
    }

    let comuneDaAmministrare = await Comune.findOne({ nomeComune: req.body.comune })

    if(!comuneDaAmministrare){
        comuneDaAmministrare = new Comune({
            "nomeComune": req.body.comune,
        })
    
    }

    try {
        await comuneDaAmministrare.save()
    } catch (err) {
        //console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate 
            return res.status(409).send({ error: 'already exist!' });
        }
        return res.status(400).send(err)
    }

    const richiestaRuolo = new RichiestaRuolo({
        richiedente: user._id,
        ruoloRichiesto: "sindaco",
        comuneDaAmministrare: comuneDaAmministrare._id,
        nomeSindaco: req.body.nome,
        cognomeSindaco: req.body.cognome,
        indirizzo: req.body.indirizzo
    })
    
    try {
        await richiestaRuolo.save()
    } catch (err) {
        //console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate 
            return res.status(409).send({ error: 'already exist!' });
        }
        return res.status(400).send(err)
    }

    res.status(200).send(user)
});






router.patch('/acceptRejectRuolo', async(req, res, next) => {
    const richiestaRuolo = await RichiestaRuolo.findOne({ _id: req.body.requestId })

    if(!richiestaRuolo){
        return next(createError(401, "richiesta ruolo non trovata"))
    }

    if(req.body.response == "ACCEPT"){
        richiestaRuolo.statoRichiesta = 'ACCEPTED'

        const user = await User.findOne({ _id: richiestaRuolo.richiedente })
        const comune = await Comune.findOne({ _id: richiestaRuolo.comuneDaAmministrare })

        user.ruolo = 'sindaco'
        user.comuneAmministrato = comune._id
        user.nomeSindaco = richiestaRuolo.nomeSindaco
        user.cognomeSindaco = richiestaRuolo.cognomeSindaco
        user.indirizzo = richiestaRuolo.indirizzo

        comune.sindaco = user._id

        try {
            await user.save()
            await comune.save()
        } catch (err) {
            //console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate 
                return res.status(409).send({ error: 'already exist!' });
            }
            return res.status(400).send(err)
        }


    }else if(req.body.response == "REJECT"){
        richiestaRuolo.statoRichiesta = 'REJECTED'
    }


    try {
        await richiestaRuolo.save()

    } catch (err) {
        //console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate 
            return res.status(409).send({ error: 'already exist!' });
        }
        return res.status(400).send(err)
    }


    res.send(richiestaRuolo)

})







router.patch('/revocaRuoloSindaco', authFacoltativa, async(req, res, next) => {
    
    if(req.body.comune){
        const comune = await Comune.findOne({ nomeComune: req.body.comune })
        if(!comune){
            return next(createError(401, "comune not found"))
        }
        if(!comune.sindaco){
            return next(createError(401, "questo comune non ha un sindaco"))
        }

        const user = await User.findById(comune.sindaco)

        if(!comune.sindaco){
            return next(createError(500, "_id sindaco errata nel DB"))
        }

        comune.sindaco = undefined
        user.comuneAmministrato = undefined
        user.nomeSindaco = undefined
        user.cognomeSindaco = undefined
        user.ruolo = 'cittadino'

        try {
            await user.save()
            await comune.save()
        } catch (err) {
            //console.log(err)
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate 
                return res.status(409).send({ error: 'already exist!' });
            }
            return res.status(400).send(err)
        }

        return res.send({"comune": comune, "user": user})
    }


})

module.exports = router;
