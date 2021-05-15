const express = require('express')
const User = require('../models/User')
const Comune = require('../models/Comune')
const auth = require('../middleware/auth')
const router = express.Router()

/************
 * Router per gestione utenti
 * 
 */


/*logged user info*/
router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    let user = await User.findOne({ uid: req.user.uid }).populate('comuneDiResidenza').populate('comuniDiInteresse')

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

    user.comuniDiInteresse.sort((a,b) => (a.nomeComune>b.nomeComune) ? 1 : ((b.nomeComune > a.nomeComune) ? -1 : 0))

    res.status(200).send(user)
});


/*DELETE comune utente*/
router.delete('/me/comuni', auth, async(req, res) => {
    const user = await User.findOne({ uid: req.user.uid })

    const comuneCancella = await Comune.findOne({ nomeComune: req.body.comune })
    
    
    if(!comuneCancella){
        return res.status(404).send("errore comune non trovato")
    }


    user.comuniDiInteresse = user.comuniDiInteresse.filter(comune => {
        return (!comuneCancella._id.equals(comune._id))                 
    })

    try {
        await user.save()
    } catch (err) {
        console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate targa
            return res.status(409).send({ error: 'already exist!' });
        }
        return res.status(400).send(err)
    } 

    res.send(user)
});

/*PATCH comune utente*/
router.patch('/me/comuni', auth, async(req, res) => {

    console.log("Richiesta modifica comuni utente")

    let user = await User.findOne({ uid: req.user.uid })    
    const comuneAggiungi = await Comune.findOne({ nomeComune: req.body.comuneAggiungi })
    
    console.log(req.body)

    if(!comuneAggiungi){
        return res.status(404).send("errore comune non trovato")
    }
    if(req.body.diResidenza){
        user.comuneDiResidenza = comuneAggiungi._id
    }
    else{
        if(req.body.comuneCancella){
            const comuneCancella = await Comune.findOne({ nomeComune: req.body.comuneCancella })

            if(!comuneCancella){
                return res.status(404).send("errore comune non trovato")
            }

            console.log(comuneCancella)
            user.comuniDiInteresse = user.comuniDiInteresse.filter(comune => {
                return (!comuneCancella._id.equals(comune._id))                 
            })

            user.comuniDiInteresse.push(comuneAggiungi._id)
        }
        else{
            user.comuniDiInteresse.push(comuneAggiungi._id)
        }
    }

    try {
        await user.save()
    } catch (err) {
        console.log(err)
        if (err.name === 'MongoError' && err.code === 11000) {
            // Duplicate targa
            return res.status(409).send({ error: 'already exist!' });
        }
        return res.status(400).send(err)
    }      

    
    res.status(200).send(user)
});



router.get('/me/categorieDisponibili', auth, async(req, res) => {
    // View logged in user profile
    let user = await User.findOne({ uid: req.user.uid }).populate('comuneDiResidenza').populate('comuniDiInteresse')
    if(!user){
        user = new User({
            "uid": req.user.uid,
            "ruolo": "cittadino",
            "comuneDiResidenza": null,
            "comuniDiInteresse": []
        })

        try {
            await user.save()
            return res.status(200).send({
                "categorieDiInteresse": ['SPORT', 'MUSICA', 'TEATRO', 'GENERICO']
            })
        } catch (err) {
            if (err.name === 'MongoError' && err.code === 11000) {
                // Duplicate targa
                return res.status(409).send({ error: 'already exist!' });
            }
            res.status(400).send(err)
        }        
    }

    let categorieDiInteresse = []
    if(!user.comuneDiResidenza){
        categorieDiInteresse = ['SPORT', 'MUSICA', 'TEATRO', 'GENERICO']
    }
    else{
        categorieDiInteresse = user.comuneDiResidenza.categorieDisponibili
    }

    user.comuniDiInteresse.forEach(comune => {
        let cat = comune.categorieDisponibili
        cat.forEach(categoria => {
            if(!categorieDiInteresse.includes(categoria)){
                categorieDiInteresse.push(categoria)
            }
        })
    });

    res.status(200).send({"categorieDiInteresse" : categorieDiInteresse})
});

module.exports = router;