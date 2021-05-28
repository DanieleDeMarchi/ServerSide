/***********
 * Funzioni chiamate per mostrare un alert di bootstrap nella pagina.
 * Viene visualzzato il messaggio contenuto in error
 */
 function errorAlert(error){
    $('#failAlert').removeAttr('hidden');
    $('#failAlert').slideDown(500);
    $('#failAlert').delay(3000).slideUp(500);

    console.log(error)
    console.log(error.message)
    let messaggio = `${error.message}`
    if(error.message == "409 Conflict")
        messaggio = "Esiste già questo elemento!!"
    document.getElementById("failAlert").innerHTML = `ERRORE! : ${messaggio}`; 
}

/**
 * 
 * Viene visualizzato un bootstrap alert di successo con il testo contenuto in messaggio
 */
function successAlert(messaggio){
    $('#successAlert').removeAttr('hidden');
    $('#successAlert').slideDown(500);
    $('#successAlert').delay(3000).slideUp(500);

    document.getElementById("successAlert").innerHTML = `Fatto! : ${messaggio}`; 

}