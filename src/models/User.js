const { conn } = require("../db");

async function create(data) {
    const sql = `
        INSERT INTO 
            user (name, email, image, telefone, password, minicurriculo, urlsite, curriculo_redesocial, ehPalestrante)
        VALUES
            (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const db = await conn();

    const { name, email, image, telefone, password, minicurriculo, urlsite, curriculo_redesocial, ehPalestrante } = data;

    try {
        const { lastID } = await db.run(sql, [name, email, image, telefone, password, minicurriculo, urlsite, curriculo_redesocial, ehPalestrante]);
    
        return lastID;
    } catch (error) {
        console.error(error)
        return error;
    }
};

async function update(id, data) {
    const sql = `
        UPDATE
            user
        SET
            name = ?, email = ?, telefone = ?
        WHERE
            id = ?
    `;

    const db = await conn();

    const { name, email, telefone } = data;

    const { changes } = await db.run(sql, [name, email, telefone, id]);

    return changes;
}

async function readByID(id) {
    const sql = `
        SELECT 
            user.id, user.name, user.email, user.telefone
        FROM
            user
        WHERE
            id = ?
    `;

    const db = await conn();

    const user = await db.get(sql, [id]);

    return user;
}

async function readByEmail(email) {
    const sql = `
        SELECT
            *
        FROM
            user
        WHERE
            email = ?
    `;

    const db = await conn();

    const user = await db.get(sql, email);

    return user;
}

async function destroy(id) {
    const sql = `
        DELETE FROM
            user
        WHERE
            id = ?
    `;

    const db = await conn();

    const { lastID } = await db.run(sql, [id]);

    return lastID;
}

async function readAll() {
    const sql = `
        SELECT
            user.name, user.telefone, user.ehPalestrante 
        FROM
            user
    `;

    const db = await conn();

    const allUsers = await db.all(sql);

    return allUsers;
}

module.exports = { create, readByID, readByEmail, update, destroy, readAll };