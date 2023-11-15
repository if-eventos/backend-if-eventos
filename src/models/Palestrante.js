const { conn } = require("../db");
const { readByEmail } = require("./User");

async function adicionarPalestrante(data) {
    const sql = `
        INSERT INTO
            palestrantes_evento (idEvento, idPalestrante)
        VALUES
            (?, ?)
    `;

    const { emailUser, idEvento } = data;

    const { id } = await readByEmail(emailUser);

    const db = await conn();


    const { lastID } = await db.run(sql, [idEvento, id]);

    return lastID;
}

async function removerPalestrante(emailUser, idEvent) {
    const sql = `
        DELETE FROM 
            palestrantes_evento
        WHERE
            idEvento = ? and idPalestrante = ?
    `;

    const { id } = await readByEmail(emailUser);

    const db = await conn();

    const { lastID } = await db.run(sql, [idEvent, id]);

    return lastID;
}

//busca todos os Palestrantes de um evento:
async function todosPalestrantesEvento(idEvent) {
    const sql = `
        SELECT
            user.id, user.name, user.telefone, user.email, user.minicurriculo, user.urlsite, user.curriculo_redesocial
        FROM
            palestrantes_evento INNER JOIN user
        WHERE
            user.id == palestrantes_evento.idPalestrante AND palestrantes_evento.idEvento == ?
    `;

    const db = await conn();

    const palestrantes = await db.all(sql, [idEvent]);

    return palestrantes;
}

async function todosPalestrantes() {
    const sql = `
        SELECT
            user.id, user.name, user.telefone, user.email, user.minicurriculo, user.urlsite, user.curriculo_redesocial
        FROM
            user
        WHERE
            ehPalestrante == 1
    `;

    const db = await conn();

    const palestrantes = await db.all(sql);

    return palestrantes;
}

module.exports = { adicionarPalestrante, removerPalestrante, todosPalestrantesEvento, todosPalestrantes };