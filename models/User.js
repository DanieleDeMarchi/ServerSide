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
    ]

})

const User = mongoose.model('User', userSchema)

module.exports = User
