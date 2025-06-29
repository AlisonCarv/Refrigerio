// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const db = require('../config/db');

const findBookByAbbreviation = (abbreviation) => {
  return db('books').where({ abbreviation }).first();
};

const findChapter = ({ book_id, chapter_number }) => {
  return db('chapters').where({ book_id, chapter_number }).first();
};

const findPreviousBook = (book_id) => {
  return db('books').where('id', book_id - 1).first();
};

const findNextBook = (book_id) => {
  return db('books').where('id', book_id + 1).first();
};

module.exports = {
  findBookByAbbreviation,
  findChapter,
  findPreviousBook,
  findNextBook,
};