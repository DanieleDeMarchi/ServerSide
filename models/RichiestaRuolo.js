const mongoose = require('mongoose')

const richiestaRuoloSchema = mongoose.Schema({
    richiedente: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    statoRichiesta:{
        type: String, 
        enum: ['PENDING', 'ACCEPTED', 'REJECTED'],
        default: 'PENDING',
        required: true
    },
    ruoloRichiesto: {
        type: String, 
        enum: ['organizzazione', 'amministrativo', 'sindaco'], 
        required: true 
    },
    comuneDaAmministrare:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comune',
        required:[
            function(){return this.ruoloRichiesto == 'sindaco'},
            'Ruolo sindaco necessario per impostare comuneAmministrato'
        ] 
    },
    nomeSindaco:{
        type: String,
        required:[
            function(){return this.ruoloRichiesto == 'sindaco'},
            'Ruolo sindaco necessario per impostare nomeSindaco'
        ]
    },
    cognomeSindaco:{
        type: String,
        required:[
            function(){return this.ruoloRichiesto == 'sindaco'},
            'Ruolo sindaco necessario per impostare cognomeSindaco'
        ]
    },
    indirizzo:{
        type: String
    }

})

const richiestaRuolo = mongoose.model('richiestaRuoloSchema', richiestaRuoloSchema)

module.exports = richiestaRuolo