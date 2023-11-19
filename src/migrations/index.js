const { conn } = require('../db');

async function up() {
    const db = await conn();

    await db.run(`
        CREATE TABLE IF NOT EXISTS user (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT UNIQUE,
            telefone TEXT,
            password TEXT,

            minicurriculo TEXT,
            urlsite TEXT,
            curriculo_redesocial TEXT,
            
            ehPalestrante INTEGER
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS evento (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            nome TEXT UNIQUE,
            descricao TEXT,
            image TEXT,
            data_hora DATE,
            urlsiteoficial TEXT,
            createBy INTEGER,
            FOREIGN KEY (createBy) REFERENCES user (id)
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS ouvintes_evento (
            idEvento INTEGER,
            idOuvinte INTEGER,
            FOREIGN KEY (idOuvinte) REFERENCES user (id),
            FOREIGN KEY (idEvento) REFERENCES evento (id),
            PRIMARY KEY(idEvento, idOuvinte)
        )
    `);

    await db.run(`
        CREATE TABLE IF NOT EXISTS palestrantes_evento (
            idEvento INTEGER,
            idPalestrante INTEGER,
            FOREIGN KEY (idPalestrante) REFERENCES user (id),
            FOREIGN KEY (idEvento) REFERENCES evento (id),
            PRIMARY KEY(idEvento, idPalestrante)
        )
    `);

    //remover ouvintes quando excluir algum evento:
    await db.run(`
        CREATE TRIGGER RemoverOuvintes
        BEFORE DELETE ON evento
        BEGIN
            DELETE FROM ouvintes_evento WHERE idEvento = OLD.id;
        END
    `);

    //remover ouvintes quando excluir algum evento:
    await db.run(`
        CREATE TRIGGER RemoverEventosAoDeletarUsuario
        BEFORE DELETE ON user
        BEGIN
            DELETE FROM evento WHERE createBy = OLD.id;
        END
    `);
}

// up()
module.exports = {up};