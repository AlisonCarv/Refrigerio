// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const fs = require('fs/promises');
const path = require('path');

// Função para processar um arquivo de texto e retornar uma estrutura de dados
async function parseBibleFile(filePath) {
  const books = [];
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    const content = data.split(/\r?\n/); // Divide o arquivo em linhas

    let currentBook = null;

    for (const line of content) {
      const trimmedLine = line.trim();
      if (!trimmedLine) continue; // Pula linhas vazias

      // Regex para encontrar o nome do livro e a abreviação, ex: "Gênesis (GEN)"
      const bookMatch = trimmedLine.match(/^(.+?)\s+\((.+?)\)$/);
      if (bookMatch) {
        if (currentBook) {
          books.push(currentBook);
        }
        currentBook = {
          name: bookMatch[1].trim(),
          abbreviation: bookMatch[2].trim(),
          chapters: [],
        };
        continue;
      }

      // Regex para encontrar o número total de capítulos, ex: "Capítulos: 50"
      const totalChaptersMatch = trimmedLine.match(/^Capítulos:\s*(\d+)/i);
      if (totalChaptersMatch && currentBook) {
        currentBook.total_chapters = parseInt(totalChaptersMatch[1], 10);
        continue;
      }

      // Regex para encontrar o número de versículos por capítulo, ex: "Capítulo 1: 31"
      const chapterMatch = trimmedLine.match(/^Capítulo\s+(\d+):\s*(\d+)/i);
      if (chapterMatch && currentBook) {
        currentBook.chapters.push({
          chapter_number: parseInt(chapterMatch[1], 10),
          total_verses: parseInt(chapterMatch[2], 10),
        });
      }
    }

    // Adiciona o último livro processado
    if (currentBook) {
      books.push(currentBook);
    }
  } catch (error) {
    console.error(`Erro ao ler ou processar o arquivo ${filePath}:`, error);
  }
  return books;
}


exports.seed = async function(knex) {
  console.log('Iniciando o seeding da estrutura da Bíblia...');

  // Limpa as tabelas existentes para evitar duplicação
  await knex('chapters').del();
  await knex('books').del();
  console.log('Tabelas antigas de books e chapters limpas.');

  // Caminho para os arquivos de dados
  const oldTestamentPath = path.join(__dirname, 'Velho Testamento.txt');
  const newTestamentPath = path.join(__dirname, 'Novo Testamento.txt');

  // Processa ambos os arquivos
  const oldTestamentBooks = await parseBibleFile(oldTestamentPath);
  const newTestamentBooks = await parseBibleFile(newTestamentPath);

  const allBooks = [...oldTestamentBooks, ...newTestamentBooks];

  console.log(`Encontrados ${allBooks.length} livros para popular.`);

  for (const book of allBooks) {
    // Insere o livro na tabela 'books' e pega o ID retornado
    const [bookId] = await knex('books').insert({
      name: book.name,
      abbreviation: book.abbreviation,
      total_chapters: book.total_chapters || book.chapters.length,
    }).returning('id'); // 'returning' funciona com PostgreSQL, mas com SQLite pega o último ID inserido

    const bookIdObject = typeof bookId === 'object' ? bookId.id : bookId;
    
    // Prepara os dados dos capítulos para inserção em lote (bulk insert)
    const chaptersToInsert = book.chapters.map(chapter => ({
      book_id: bookIdObject,
      chapter_number: chapter.chapter_number,
      total_verses: chapter.total_verses,
    }));

    if (chaptersToInsert.length > 0) {
      await knex('chapters').insert(chaptersToInsert);
    }
    console.log(`Livro "${book.name}" e seus ${chaptersToInsert.length} capítulos foram inseridos.`);
  }

  console.log('Seeding da estrutura da Bíblia concluído com sucesso!');
};