// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const db = require('../config/db');

const findByUsername = (username) => {
  return db('users').where({ username }).first();
};

module.exports = {
  findByUsername,
};