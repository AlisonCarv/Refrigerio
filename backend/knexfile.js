module.exports = {
  development: {
    client: 'sqlite3',
    connection: {
      filename: './src/config/database.db' // O arquivo do banco ficará aqui
    },
    migrations: {
      directory: './src/config/migrations' // Onde as migrations ficarão
    },
    seeds: {
      directory: './src/config/seeds' // Onde os seeders ficarão
    },
    useNullAsDefault: true,
  },
};