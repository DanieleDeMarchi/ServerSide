const mongoose = require('mongoose')
const ComuneSchema = require('./Comune')

const userSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        trim: true
    },
    ruolo: {
        type: String, 
        enum: ['cittadino', 'organizzazione', 'amministrativo', 'sindaco'], 
        default: 'cittadino',
        required: true 
    },
    comuneDiResidenza: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comune',
        required: false
    },
    comuniDiInteresse:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comune'
        }
    ],
    comuneAmministrato:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Comune',
        required:[
            function(){return this.ruolo == 'sindaco'},
            'Ruolo sindaco necessario per impostare comuneAmministrato'
        ] 
    },
    nomeSindaco:{
        type: String,
        required:[
            function(){return this.ruolo == 'sindaco'},
            'Ruolo sindaco necessario per impostare nomeSindaco'
        ]
    },
    cognomeSindaco:{
        type: String,
        required:[
            function(){return this.ruolo == 'sindaco'},
            'Ruolo sindaco necessario per impostare cognomeSindaco'
        ]
    },
    indirizzo:{
        type: String
    },
    deviceToken:[
        {
            type: String
        }
    ]

})

const User = mongoose.model('User', userSchema)

module.exports = User
