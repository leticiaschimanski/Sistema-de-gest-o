const Database = require("better-sqlite3");

// Cria/abre o banco de dados
const db = new Database("banco.db");

// Cria a tabela de usuários se ela ainda não existir
db.prepare(`
    CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        senha TEXT NOT NULL,
        perfil TEXT NOT NULL DEFAULT 'usuario'
    )
`).run();

console.log("Banco de dados conectado com sucesso!");

module.exports = db;