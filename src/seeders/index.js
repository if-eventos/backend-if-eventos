//seeders aqui:
const user = require("../models/User");
const evento = require("../models/Evento");
const ouvinte = require("../models/Ouvintes");
const palestrante = require("../models/Palestrante");
const fs = require('fs');
const path = require('path');


async function up() {
    const content = fs.readFileSync(path.join(__dirname, 'data.json'));
    const data = JSON.parse(content);

    for (const element of data.user) {
        await user.create(element);
    }

    for (const element of data.evento) {
        await evento.create(element);
    }

    for (const element of data.ouvintes_evento) {
        await ouvinte.adicionarOuvinte(element);
    }

    for (const element of data.palestrantes_evento) {
        await palestrante.adicionarPalestrante(element);
    }
}

module.exports = { up };