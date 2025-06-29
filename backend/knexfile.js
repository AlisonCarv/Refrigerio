// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/config/database.db'
    },
    migrations: {
      directory: './src/config/migrations'
    },
    seeds: {
      directory: './src/config/seeds'
    },
    // ADICIONAR: Configuração explícita do pool
    pool: {
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done); // Habilita chaves estrangeiras para SQLite
      }
    },
    useNullAsDefault: true,
  },
};