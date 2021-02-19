const mongoose = require('mongoose')

const eventSchema = mongoose.Schema({
    organizzatore: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false
    },
    titoloEvento:{
        type: String,
        required: true
    },
    data: {
        type: Date,
        required: true
    },
    categoria:{
        type: String,
        enum: ['SPORT', 'MUSICA', 'TEATRO', 'GENERICO'],
        default: 'GENERICO',
        required: true
    },
    comune:{
        type: String,
        required: true
    },
    indirizzo:{
        type: String,
        required: true
    },
    info_url:{
        type: String,
    },
    image_url:{
        type: String
    },
    descrizione: {
        type: String,
        required: false
    },
    civicPoints:{
        type: Number
    }
})


eventSchema.path('info_url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

eventSchema.path('image_url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

const Event = mongoose.model('Event', eventSchema)

module.exports = Event