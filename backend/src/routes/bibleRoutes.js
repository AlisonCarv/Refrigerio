// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const router = express.Router();
const db = require('../config/db');
const { protect } = require('../middleware/authMiddleware');

// --- ROTA DE SUGESTÃO (PÚBLICA) ---
router.get('/suggestion/:version', async (req, res) => {
  const { version } = req.params;

  if (!version) {
    return res.status(400).json({ message: 'A versão é obrigatória.' });
  }

  try {
    const apiUrl = `https://bible-api.com/data/${version}/random`;
    const apiResponse = await fetch(apiUrl);
    const data = await apiResponse.json();

    if (!apiResponse.ok || data.error) {
      throw new Error(data.error || 'Não foi possível obter a sugestão.');
    }

    if (data.random_verse) {
      res.status(200).json(data.random_verse);
    } else {
      res.status(404).json({ message: 'Sugestão não encontrada no formato esperado.' });
    }
  } catch (error) {
    console.error('Erro ao buscar sugestão da API externa:', error);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  }
});

// --- ROTAS DE FAVORITOS (PROTEGIDAS) ---

// Rota POST para /api/favorites
router.post('/favorites', protect, async (req, res) => {
  const { reference, text, version } = req.body;
  const user_id = req.user.id;

  if (!reference || !text || !version) {
    return res.status(400).json({ message: 'Referência, texto e versão são obrigatórios.' });
  }

  try {
    const existingFavorite = await db('favorites')
      .where({ user_id: user_id, reference: reference })
      .first();

    if (existingFavorite) {
      return res.status(200).json({ message: 'Versículo já estava nos favoritos.', favorite: existingFavorite });
    }

    const newFavorite = { user_id, reference, text, version };
    const [id] = await db('favorites').insert(newFavorite);
    res.status(201).json({ id, ...newFavorite });
  } catch (error) {
    console.error('Erro ao salvar favorito:', error);
    res.status(500).json({ message: 'Erro ao salvar favorito.' });
  }
});

// Rota GET para /api/favorites
router.get('/favorites', protect, async (req, res) => {
  const user_id = req.user.id;
  
  try {
    const favorites = await db('favorites').where({ user_id });
    res.status(200).json(favorites);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    res.status(500).json({ message: 'Erro ao buscar favoritos.' });
  }
});

// Rota DELETE para /api/favorites
router.delete('/favorites', protect, async (req, res) => {
  const { reference } = req.body;
  const user_id = req.user.id;

  if (!reference) {
    return res.status(400).json({ message: 'A referência do versículo é obrigatória.' });
  }

  try {
    const deletedCount = await db('favorites')
      .where({ user_id: user_id, reference: reference })
      .del();

    if (deletedCount > 0) {
      res.status(200).json({ message: 'Favorito removido com sucesso.' });
    } else {
      res.status(404).json({ message: 'Favorito não encontrado para este usuário.' });
    }
  } catch (error) {
    console.error('Erro ao remover favorito:', error);
    res.status(500).json({ message: 'Erro ao remover favorito.' });
  }
});


// --- ROTA DE BUSCA E NAVEGAÇÃO ---
router.post('/verse/search', async (req, res) => {
  const { book, chapter, verse, version } = req.body;

  if (!book || !chapter || !verse || !version) {
    return res.status(400).json({ message: 'Livro, capítulo, versículo e versão são obrigatórios.' });
  }

  try {
    const bookNameForApi = book.trim().replace(/\s+/g, '+');
    const apiUrl = `https://bible-api.com/${bookNameForApi}+${chapter}:${verse}?translation=${version}`;
    
    const apiResponse = await fetch(apiUrl);
    const apiData = await apiResponse.json();

    if (!apiResponse.ok || apiData.error) {
      throw new Error(apiData.error || 'Versículo não encontrado na API externa.');
    }
    
    // Usando a abreviação (book_id) que é consistente entre idiomas
    const canonicalBookAbbreviation = apiData.verses[0].book_id;
    const bookData = await db('books').where({ abbreviation: canonicalBookAbbreviation }).first();
    
    if (!bookData) {
      throw new Error('Inconsistência de dados: livro não encontrado no banco de dados local pela abreviação.');
    }

    const chapterData = await db('chapters').where({ book_id: bookData.id, chapter_number: chapter }).first();
    const currentVerseNum = parseInt(verse, 10);
    const currentChapterNum = parseInt(chapter, 10);
    const totalVersesInChapter = chapterData.total_verses;
    const totalChaptersInBook = bookData.total_chapters;

    let previousVerse = null;
    let nextVerse = null;

    if (currentVerseNum > 1) {
      previousVerse = { book: bookData.name, chapter: currentChapterNum, verse: currentVerseNum - 1 };
    } else if (currentChapterNum > 1) {
      const prevChapterData = await db('chapters').where({ book_id: bookData.id, chapter_number: currentChapterNum - 1 }).first();
      previousVerse = { book: bookData.name, chapter: currentChapterNum - 1, verse: prevChapterData.total_verses };
    } else if (bookData.id > 1) {
      const prevBookData = await db('books').where('id', bookData.id - 1).first();
      const lastChapterOfPrevBook = await db('chapters').where({ book_id: prevBookData.id, chapter_number: prevBookData.total_chapters }).first();
      previousVerse = { book: prevBookData.name, chapter: prevBookData.total_chapters, verse: lastChapterOfPrevBook.total_verses };
    }

    if (currentVerseNum < totalVersesInChapter) {
      nextVerse = { book: bookData.name, chapter: currentChapterNum, verse: currentVerseNum + 1 };
    } else if (currentChapterNum < totalChaptersInBook) {
      nextVerse = { book: bookData.name, chapter: currentChapterNum + 1, verse: 1 };
    } else {
      const nextBookData = await db('books').where('id', bookData.id + 1).first();
      if (nextBookData) {
        nextVerse = { book: nextBookData.name, chapter: 1, verse: 1 };
      }
    }

    const responsePayload = {
      reference: apiData.reference,
      text: apiData.text || (apiData.verses && apiData.verses.length > 0 ? apiData.verses[0].text : 'Texto não encontrado.'),
      version: apiData.translation_id,
      navigation: {
        previous: previousVerse,
        next: nextVerse,
      },
    };

    res.status(200).json(responsePayload);

  } catch (error) {
    console.error('Erro na rota /verse/search:', error);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  }
});

module.exports = router;