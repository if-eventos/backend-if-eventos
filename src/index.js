const express = require("express");
const fs = require('fs');
const { dbFile } = require('./db');
const path = require('path');
var cors = require('cors')

const dotenv = require('dotenv').config();

const router = require('./routes/index');

const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);
const cookieParser = require('cookie-parser');

const Seed = require('./seeders');
const Migration = require('./migrations');

const { isCelebrateError } = require('celebrate');

const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');


const app = express();

app.use(cors())
app.use(express.static('public'));


const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API REST Express de uma aplicação de criação de Eventos Acadêmicos',
    version: '1.0.0',
    description:
      'Esta é uma aplicação de API REST feita com Express.' +
      'Ela utiliza dados sobre Eventos cadastrados',
    license: {
      name: 'Licenciado sob GPL.',
      url: 'https://github.com/if-eventos/backend-if-eventos',
    },
    contact: {
      name: 'Grupo 6',
      url: 'https://github.com/if-eventos/backend-if-eventos',
    },
  },
  servers: [
    {
      url: 'http://localhost:3000',
      description: 'Servidor de desenvolvimento',
    }
    ,
    {
      url: 'https://if-eventos-backend.onrender.com/',
      description: 'Servidor de produção',
    },
  ],
};
const options = {
  swaggerDefinition,
  apis: ['./src/routes/api_user.js', './src/routes/api_evento.js', './src/routes/api_ouvinte.js', './src/routes/api_palestrante.js'],
};
const swaggerSpec = swaggerJSDoc(options);



(async () => {
    if (!fs.existsSync(dbFile)) {
      await Migration.up();
      await Seed.up();
    }
})();



app.use(express.json())
app.use(cookieParser());
app.use(express.static('public'));
app.use(express.urlencoded({extended: false }));



app.use(
  session({
    store: new SQLiteStore(),
    secret: process.env.SECRET, // used to sign the cookie
    name: 'sessionId', // change session name for better security
    resave: false, // deactivates saving a session when it's not modified
    saveUninitialized: true, // save new sessions even if they're not modified
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, // 1 week
  })
);

app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use(router);

app.use((err, req, res, next) => {
  
  if (isCelebrateError(err)) {
    console.error(err);
    return res.status(400).json({ error: "Um ou mais campos invalidos!"});
  }

});

app.listen(3000, () => console.log('Servidor da aplicação rodando: http://localhost:3000'));