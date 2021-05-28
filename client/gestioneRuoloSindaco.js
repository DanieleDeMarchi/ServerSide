const express = require('express')
const router = express.Router()
var request = require("request");
require('dotenv').config();

/************
 * Router per gestione RUOLI utenti
 * 
 */

 router.get('/pannelloAmministrazioneSindaci', async(req, res, next)  => {

    const options = {
        url: `http://${process.env.SERVER_ADDRESS}/gestione_ruoli/getAll`,
    }

    
    var promise = new Promise((resolve, reject) => {
        request.get(options, 
        (error, response, body) => {
            if (error){
                reject(error);
            }
            if(response.statusCode != 200){
                reject(response.statusCode)
            }
            resolve(body);
        });
    }).catch(error => {
        console.log(error);
        res.render('error.ejs', {error} )
        //console.log(error)
    });

    promise.then(value => {
        const listaRichieste = value

        options.url = `http://${process.env.SERVER_ADDRESS}/gestione_ruoli/listaSindaci`

        let secondPromise = new Promise((resolve, reject) => {
            request.get(options, 
                (error, response, body) => {
                    if (error){
                        reject(error);
                    }
                    if(response.statusCode != 200){
                        reject(response.statusCode)
                    }
                    resolve(body);
                });
            }).then(value => {
                console.log("OK!")
                res.render('pannelloAmministrazioneSindaco.ejs', {data: {
                                                    "listaSindaci": value,
                                                    "listaRichieste" : listaRichieste
                                                }} )
    
            }).catch(error => {        
                console.log(error);
                res.render('error.ejs', {error} )
                //console.log(error)
            });
    })

 })



 module.exports = router;
