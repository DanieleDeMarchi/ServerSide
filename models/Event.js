const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    organizzatore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    comune: {
        type: String,
        required: true
    },
    titoloEvento:{
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    descrizione: {
        type: String,
        required: false
    }
})

const Car = mongoose.model('Event', eventSchema)

module.exports = Car