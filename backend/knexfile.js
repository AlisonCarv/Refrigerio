// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/config/database.db'
    },
    // Configuração explícita do Pool de Conexões
    pool: {
      min: 2,
      max: 10,
      afterCreate: (conn, done) => {
        conn.run('PRAGMA foreign_keys = ON', done);
      }
    },
    migrations: {
      directory: './src/config/migrations'
    },
    seeds: {
      directory: './src/config/seeds'
    },
    useNullAsDefault: true,
  },
};