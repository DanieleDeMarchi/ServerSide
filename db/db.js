/**
 * Connessione al Server MONGODB
 * DEV'ESSERE PRESENTE LA CHIAVE DI CONNESSIONE NELLE VARIABILI D'AMBIENTE
 */

require('dotenv').config();
const mongoose = require('mongoose');

const connectionString = process.env.MONGODB_URL;

mongoose.connect(connectionString, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true
}).then((event)=>{
    console.log("Connected to database");
});
