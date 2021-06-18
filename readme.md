# CIVIC POINTS SERVER SIDE DOCUMENTATION

<!-- @import "[TOC]" {cmd="toc" depthFrom=1 depthTo=6 orderedList=false} -->

<!-- code_chunk_output -->

- [CIVIC POINTS SERVER SIDE DOCUMENTATION](#civic-points-server-side-documentation)
  - [Principali tecnologie utilizzate](#principali-tecnologie-utilizzate)
  - [Sviluppo su pc locale](#sviluppo-su-pc-locale)
    - [Envoirements variable](#envoirements-variable)
      - [address](#address)
      - [mongodb atlas](#mongodb-atlas)
      - [firebase credentials](#firebase-credentials)
      - [avvio del server](#avvio-del-server)
  - [Struttura server](#struttura-server)
    - [Struttura file/cartelle](#struttura-filecartelle)
      - [Testing](#testing)
  - [Documentazione API](#documentazione-api)

<!-- /code_chunk_output -->

## Principali tecnologie utilizzate

- Node.js versione [10.x, 12.x, 14.x, 15.x]
- Framework express per realizzazione API
- Database MongoDB Atlas

Ulteriori dipendenze da librerie esterne sono specificate nel file package.json

## Sviluppo su pc locale

Per sviluppare da locale è necessario svolgere i seguenti passi:

1. impostare variabili d'ambiente
2. installare dipendenze librerie
3. avvio del server

### Envoirements variable

È necessario impostare delle variabili d'ambiente per il corretto funzionamento del server (tramite variabili d'ambiente o .env file)

##### address

- SERVER_ADDRESS : indirizzo http server
  (per sviluppo locale impostare SERVER_ADDRESS = http://localhost:3001)

##### mongodb atlas

- MONGODB_URL : url per connessione a MongoDB Atlas

##### firebase credentials

(recuperarle dalla console firebase)

- FIREBASE_CLIENT_EMAIL
- FIREBASE_PROJECT_ID
- FIREBASE_PRIVATE_KEY

#### avvio del server

da linea di comando:

1. `npm install` installa le dipendenze descritte nel file package.json
2. avvio del server (2 alternative):
   - `npm start:dev` avvia il server in modalità sviluppo (ad ogni cambiamento e salvataggio nella cartella, il server si riavvia)
   - `npm start`

## Struttura server

Per l'architettura dell'applicazione fare riferimento al manuale tecnico

### Struttura file/cartelle

```
.
├── app.js          // express configuration file
├── bin
│   └── www         // entry point application
├── db              // file configurazione e connessione DB
│   ├── db.js
│   └── firebase.js
├── middleware      // Express middlewares
│   ├── auth.js
│   └── authNonObbligatoria.js
├── models          // moongose models (DAO)
│   ├── Comune.js
│   ├── Event.js
│   ├── Project.js
│   ├── RichiestaRuolo.js
│   └── User.js
├── package.json
├── readme.md
├── routes          // Express routers
│   ├── comuni.js
│   ├── events.js
│   ├── projects.js
│   ├── ruoli.js
│   └── users.js
└── test            // Tests folder
   └── testEnpoint.js
```

#### Testing

per avviare i test automatici
`npm test`

## Documentazione API

https://app.swaggerhub.com/apis-docs/DanieleDeMarchi/ingSwApi/1.0.0
