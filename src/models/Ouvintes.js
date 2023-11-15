const { conn } = require("../db");
const { readByEmail } = require("./User");

async function adicionarOuvinte(data) {
    const sql = `
        INSERT INTO
            ouvintes_evento ( idEvento, idOuvinte )
        VALUES
            (?, ?)
    `;

    const {emailUser, idEvento } = data
    const { id } = await readByEmail(emailUser);

    const db = await conn();

    const { lastID } = await db.run(sql, [idEvento, id]);

    return lastID;
}

async function removerOuvinte(emailUser, idEvent) {
    const sql = `
        DELETE FROM 
            ouvintes_evento
        WHERE
            idEvento = ? and idOuvinte = ?
    `;

    const { id } = await readByEmail(emailUser);

    const db = await conn();

    const { lastID } = await db.run(sql, [idEvent, id]);

    return lastID;
}

//busca todos os ouvintes de um evento:
async function todosOuvintesEvento(idEvent) {
    const sql = `
        SELECT
            user.id, user.name, user.telefone, user.email
        FROM
            ouvintes_evento INNER JOIN user
        WHERE
            user.id == ouvintes_evento.idOuvinte AND ouvintes_evento.idEvento == ?
    `;

    const db = await conn();

    const ouvintes = await db.all(sql, [idEvent]);

    return ouvintes;
}

//Retorna todos os eventos que o usuario está participando como ouvinte:
async function readAllByUser (idUser) {
    const sql = `
        SELECT
            *
        FROM
            ouvintes_evento INNER JOIN evento
        WHERE
            ouvintes_evento.idOuvinte = ? AND ouvintes_evento.idEvento = evento.id
    `;

    const db = await conn();

    const eventos = await db.all(sql, [idUser]);

    return eventos;
}

module.exports = { adicionarOuvinte, removerOuvinte, todosOuvintesEvento, readAllByUser };