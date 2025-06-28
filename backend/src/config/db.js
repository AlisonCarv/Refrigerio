const knex = require('knex');
const knexConfig = require('../../knexfile');

// Usamos a configuração de 'development' do nosso knexfile
const db = knex(knexConfig.development);

module.exports = db;