// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const db = require('../config/db');

const findByUser = (user_id) => {
  return db('favorites').where({ user_id });
};

const findOne = ({ user_id, reference }) => {
  return db('favorites').where({ user_id, reference }).first();
};

const create = (favoriteData) => {
  return db('favorites').insert(favoriteData);
};

const remove = ({ user_id, reference }) => {
  return db('favorites').where({ user_id, reference }).del();
};

module.exports = {
  findByUser,
  findOne,
  create,
  remove,
};