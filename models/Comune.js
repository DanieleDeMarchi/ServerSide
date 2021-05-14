const mongoose = require('mongoose')

const comuneSchema = mongoose.Schema({
    sindaco: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    nomeComune:{
        type: String,
        required: true
    },
    enabled: {
        type: Boolean,
        required: true,
        default: false
    },
    categorieDisponibili:{
        type: [String],
        default: ['SPORT', 'MUSICA', 'TEATRO', 'GENERICO'],
        required: true
    }
})

const Comune = mongoose.model('Comune', comuneSchema)

module.exports = Comune