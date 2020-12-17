## **Eventi**

---

### **Crea un nuovo evento**

_Aggiungi un evento al database_

- **URL**

  <_herokuAddress/events_>

- **Method:**

  `POST`

- **URL Params**

  None

- **Data Params**

  `{ "comune": [String], "titoloEvento": [String], "descrizione": [String], "data": [String] }`

  la data dev'essere in formato `YYYY-MM-DD`

- **Success Response:**

  - **Code:** 201 <br />
    **Content:** `{ _id : ObjecId mongoDB, Data Params inseriti }`

- **Error Response:**

  - **Code:** 400 BAD REQUEST <br />
    errore se il body non è formattato correttamente

- **Sample Call:**

  Chiamata di esempio usando javascript fetch

```javascript
var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");

var raw = JSON.stringify({
  comune: "Udine",
  titoloEvento: "Evento prova",
  descrizione: "Primo evento di prova per testare inserimento",
  data: "2020-10-18",
});

var requestOptions = {
  method: "POST",
  headers: myHeaders,
  body: raw,
  redirect: "follow",
};

fetch("localhost:3001/events", requestOptions)
  .then((response) => response.text())
  .then((result) => console.log(result))
  .catch((error) => console.log("error", error));
```

esemio in dart

```javascript
var headers = {
  'Content-Type': 'application/json'
};
var request = http.Request('GET', Uri.parse('localhost:3001/events'));
request.body = '''{\r\n    "comune": "Udine",\r\n    "titoloEvento": "Evento prova",\r\n    "descrizione": "Primo evento di prova per testare inserimento",\r\n    "data": "2020-10-18"\r\n}''';
request.headers.addAll(headers);

http.StreamedResponse response = await request.send();

if (response.statusCode == 200) {
  print(await response.stream.bytesToString());
}
else {
  print(response.reasonPhrase);
}

```

---

### **Orrieni lista tutti eventi**

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
    **Content:** `[{ evento1 }, { evento2 }, { evento3 }]`

    **Formato evento**: `{ "_id": "5fdb49bbe9271123cc361462", "comune": "Udine", "titoloEvento": "Evento prova", "descrizione": "Primo evento di prova per testare inserimento", "data": "2020-10-18T00:00:00.000Z", "__v": 0 }`

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
    **Content:** `{ evento }`

    **Formato evento**: `{ "_id": "5fdb49bbe9271123cc361462", "comune": "Udine", "titoloEvento": "Evento prova", "descrizione": "Primo evento di prova per testare inserimento", "data": "2020-10-18T00:00:00.000Z", "__v": 0 }`

- **Error Response:**

  - **Code:** 404 NOT FOUND <br />
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
