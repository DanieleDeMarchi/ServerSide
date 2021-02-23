## **Eventi**

### **Crea un nuovo evento**

_Aggiungi un evento al database_

- **URL**

  <_herokuAddress/events_>

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  ```javascript
  {
    "comune": [String],
    "indirizo": [String],
    "titoloEvento": [String],
    "info_url": [String],
    "image_url": [String],
    "categoria": [String],
    "descrizione": [String],
    "data": [String]
  }
  ```

  **Required:** comune, indirizzo, titoloEvento, categoria, data.

  **Opional:** image_url, info_url, descrizione.

  <br />

  - url dev'essere completo, anche con http/https .
  - la data dev'essere un unixTimestamp in millisecondi .

  Orario non ancora aggiunto (problemi con timezone)
  <br />

- **Success Response:**

  - **Code:** 201 <br />
    **Content:** `{ _id : ObjecId mongoDB, Data Params inseriti }`

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    errore se il body non è formattato correttamente

- **Sample Call:**

Esemio in dart.
Inserisce un evento con data = timestamp attuale.
Se chiamata va a buon fine stampa 201 e l'evento appena creato in formato json.

```javascript

  var headers = {'Content-Type': 'application/json'};
  var request = http.Request(
      'POST', Uri.parse('http://< herokuAddress >/events'));
  request.body = '''{
                    "comune": "Trieste",
                    "indirizzo": "Via Rovigno, 14",
                    "info_url": "https://www.google.com/",
                    "image_url": "https://image.freepik.com/free-vector/event-poster_23-2147514870.jpg",
                    "categoria": "sport",
                    "titoloEvento": "Evento prova",
                    "descrizione": "evento di prova per testare inserimento",
                    "data": "${DateTime.now().millisecondsSinceEpoch}"
                  }''';
  request.headers.addAll(headers);

  http.StreamedResponse response = await request.send();

  if (response.statusCode == 201) {
    print(response.statusCode);
    print(await response.stream.bytesToString());
  } else {
    print(response.reasonPhrase);
  }
}


```

---

### **Ottieni lista tutti eventi**

_Ottieni una lista di tutti gli eventi inseriti nel database_

- **URL**

  <_herokuAddress/events/eventList_>

- **Method:**

  `GET`

- **URL Params**

  None

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:** `[{ evento1 }, { evento2 }, { evento3 }]`

    **Formato evento** :

    ```javascript
    {
       "categoria": "sport",
       "\_id": "602ff04ecdc3533118371e38",
       "comune": "Udine",
       "indirizzo": "Via Rovigno, 14",
       "titoloEvento": "Evento prova",
       "descrizione": "evento di prova per testare inserimento",
       "info_url": "https://www.google.com/",
       "image_url": "https://image.freepik.com/free-vector/event-poster_23-2147514870.jpg",
       "data": "2021-02-18T00:00:00.000Z",
       "\_\_v": 0
    }
    ```

- **Error Response:**

- **Sample Call:**
  Chiamata di esempio usando Dart

```javascript
var request = http.Request('GET', Uri.parse('localhost:3001/events/eventList'));


http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}
```

---

### **Ottieni lista eventi con paginazione**

_Ottieni una lista di n eventi , con offset di m eventi inseriti nel database._
_Ad esempio se si vogliono ottenere 10 eventi dal 20esimo al 29esimo si deve specificare n=10 e m=20._
_Per evitare di ottenere tutta la lista di eventi, soprattutto nel caso ci siano molti eventi nel database._
_Al momento ordinati in ordine di inserimento crescente_

- **URL**

  <_herokuAddress/events/eventList/**page**_>

- **Method:**

  `GET`

- **URL Params**

  **Required:**

  `page=[integer]` Offset (scarta i primi (page-1)\*per_page eventi)

  **Optional:**

  `per_page=[integer]` (Default `per_page = 10`)
  <br />esempio: `localhost:3001/events/eventList/3?per_page=5` per ottenere 5 eventi dal decimo al 14esimo
  <br />

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:** `[{ evento1 }, { evento2 }, { evento3 }]`

    **Formato evento** :

    ```javascript
    {
       "categoria": "sport",
       "\_id": "602ff04ecdc3533118371e38",
       "comune": "Udine",
       "indirizzo": "Via Rovigno, 14",
       "titoloEvento": "Evento prova",
       "descrizione": "evento di prova per testare inserimento",
       "info_url": "https://www.google.com/",
       "image_url": "https://image.freepik.com/free-vector/event-poster_23-2147514870.jpg",
       "data": "2021-02-18T00:00:00.000Z",
       "\_\_v": 0
    }
    ```

- **Error Response:**

- **Sample Call:**
  Chiamata di esempio usando Dart

```javascript
var request = http.Request('GET', Uri.parse('localhost:3001/events/eventList/3?per_page=5'));

http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}
```

---

### **Singolo evento**

_Ottieni informazioni di un singolo evento_

- **URL**

  <_herokuAddress/events/**eventId**_>

- **Method:**

  `GET`

- **URL Params**

  `eventId = [mongoDB objectId]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:** `{ evento }`

    **Formato evento** :

    ```javascript
    {
       "categoria": "sport",
       "\_id": "602ff04ecdc3533118371e38",
       "comune": "Udine",
       "indirizzo": "Via Rovigno, 14",
       "titoloEvento": "Evento prova",
       "descrizione": "evento di prova per testare inserimento",
       "info_url": "https://www.google.com/",
       "image_url": "https://image.freepik.com/free-vector/event-poster_23-2147514870.jpg",
       "data": "2021-02-18T00:00:00.000Z",
       "\_\_v": 0
    }
    ```

- **Error Response:**

  - **Code:** 404 NOT FOUND
    errore se il l'id non esiste

- **Sample Call:**
  Chiamata di esempio usando Dart

```javascript
var request = http.Request('GET', Uri.parse('localhost:3001/events/5fdb49bbe9271123cc361462'));


http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}

```

### **Eliminare evento**

_Elimina dal database un singolo evento (USARE CON CAUTELA, POTREBBE CAUSARE ERRORI DI INTEGRITÀ_

- **URL**

  <_herokuAddress/events/**eventId**_>

- **Method:**

  `DELETE`

- **URL Params**

  `eventId = [mongoDB objectId]`

- **Data Params**

  None

- **Success Response:**

  - **Code:** 200 <br />
  - **Content:** `{ evento_eliminato }`

    **Formato evento** :

    ```javascript
    {
      "deleted": {
         "categoria": "sport",
         "\_id": "602ff04ecdc3533118371e38",
         "comune": "Udine",
         "indirizzo": "Via Rovigno, 14",
         "titoloEvento": "Evento prova",
         "descrizione": "evento di prova per testare inserimento",
         "info_url": "https://www.google.com/",
         "image_url": "https://image.freepik.com/free-vector/event-poster_23-2147514870.jpg",
         "data": "2021-02-18T00:00:00.000Z",
         "\_\_v": 0
      }

    }
    ```

- **Error Response:**

  - **Code:** 404 NOT FOUND
    errore se il l'id non esiste

- **Sample Call:**
  Chiamata di esempio usando Dart

```javascript
var request = http.Request('DELETE', Uri.parse('localhost:3001/events/5fdb49bbe9271123cc361462'));


http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}

```
