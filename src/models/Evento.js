const { conn } = require("../db");

async function create(data) {
    const sql = `
        INSERT INTO
            evento(nome, descricao, data_hora, local_ou_link, categoria, createBy, image, latitude, longitude)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const db = await conn();

    const { nome, descricao, data_hora, local_ou_link, categoria, createBy, image, latitude, longitude } = data;

    const {lastID} = await db.run(sql, [nome, descricao, data_hora, local_ou_link, categoria, createBy, image, latitude, longitude]);

    return lastID;
}

async function readById(id) {
    const sql = `
        SELECT
            *
        FROM
            evento
        WHERE
            id = ?
    `;

    const db = await conn();

    const evento = await db.get(sql, [id]);

    return evento;
}

async function readAll() {
    const sql = `
        SELECT 
            *
        FROM
            evento
    `;

    const db = await conn();

    const eventos = await db.all(sql);

    return eventos;
}

async function readAllByUser(idUser) {
    const sql = `
        SELECT 
            *
        FROM
            evento
    `;

    const db = await conn();

    const eventos = await db.all(sql);

    const eventsByUser = eventos.filter((event) => event.createBy == idUser);

    return eventsByUser;
}

async function update(id, data) {
    const sql = `
        UPDATE
            evento
        SET
            nome = ?, descricao = ?, data_hora = ?, local_ou_link = ?
        WHERE
            id = ?
    `;

    const db = await conn();

    const { nome, descricao, data_hora, local_ou_link } = data;

    const { changes } = await db.run(sql, [nome, descricao, data_hora, local_ou_link, id]);

    return changes;
}

async function destroy(id) {
    const sql = `
        DELETE FROM
            evento
        WHERE
            id = ?
    `;

    const db = await conn();

    const { lastID } = await db.run(sql, [id]);

    return lastID;
}

async function removerPalestrante (idEvento, idPalestrante) {
    const sql = `
        DELETE FROM
            palestrantes_evento
        WHERE
            idEvento = ? AND idPalestrante = ?
    `;

    const db = await conn();
    
    const { lastID } = await db.run(sql, [idEvento, idPalestrante]);

    return lastID;
  
};

async function eventosInscritosUser (idUser) {
    const sql = `
        SELECT evento.* 
        FROM evento 
        JOIN ouvintes_evento ON evento.id = ouvintes_evento.idEvento 
        WHERE ouvintes_evento.idOuvinte = ?;
    `;

    const db = await conn();
    
    const eventosInscritos = await db.all(sql, [idUser]);

    return eventosInscritos;

}


module.exports = { create, readAll, readById, update, destroy, readAllByUser, removerPalestrante, eventosInscritosUser };