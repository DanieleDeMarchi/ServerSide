const mongoose = require('mongoose')

const projectSchema = mongoose.Schema({
    titoloEvento:{
        type: String,
        required: true
    },
    comune:{
        type: String,
        required: true
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
    },
    data: {
        type: Date,
        required: true
    },
})

projectSchema.path('image_url').validate((val) => {
    urlRegex = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-/]))?/;
    return urlRegex.test(val);
}, 'Invalid URL.');

const Project = mongoose.model('Project', projectSchema)

module.exports = Project