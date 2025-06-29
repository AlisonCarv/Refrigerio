// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const FavoriteModel = require('../models/favorite.model');
const BibleModel = require('../models/bible.model');

// Função auxiliar para fazer o fetch e tratar respostas não-JSON
async function fetchAndParse(url) {
  const response = await fetch(url);
  const contentType = response.headers.get("content-type");

  if (contentType && contentType.indexOf("application/json") !== -1) {
    const data = await response.json();
    return { ok: response.ok, data };
  } else {
    const textData = await response.text();
    return { ok: false, data: { error: textData || 'Resposta inesperada da API externa.' } };
  }
}

// --- ROTA DE SUGESTÃO (PÚBLICA) ---
router.get('/suggestion/:version', async (req, res) => {
  const { version } = req.params;
  if (!version) return res.status(400).json({ message: 'A versão é obrigatória.' });
  try {
    const apiUrl = `https://bible-api.com/data/${version}/random`;
    const { ok, data } = await fetchAndParse(apiUrl);
    if (!ok || data.error) throw new Error(data.error || 'Não foi possível obter a sugestão.');
    if (data.random_verse) res.status(200).json(data.random_verse);
    else res.status(404).json({ message: 'Sugestão não encontrada no formato esperado.' });
  } catch (error) {
    console.error('Erro ao buscar sugestão da API externa:', error);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' });
  }
});

// --- ROTAS DE FAVORITOS (PROTEGIDAS) ---
router.post('/favorites', protect, async (req, res) => {
  const { reference, text, version } = req.body;
  const user_id = req.user.id;
  if (!reference || !text || !version) return res.status(400).json({ message: 'Dados incompletos.' });
  try {
    const existing = await FavoriteModel.findOne({ user_id, reference });
    if (existing) return res.status(200).json({ message: 'Já favoritado.', favorite: existing });
    await FavoriteModel.create({ user_id, reference, text, version });
    res.status(201).json({ message: 'Favoritado com sucesso.' });
  } catch (error) { res.status(500).json({ message: 'Erro ao salvar favorito.' }); }
});

router.get('/favorites', protect, async (req, res) => {
  try {
    const favorites = await FavoriteModel.findByUser(req.user.id);
    res.status(200).json(favorites);
  } catch (error) { res.status(500).json({ message: 'Erro ao buscar favoritos.' }); }
});

router.delete('/favorites', protect, async (req, res) => {
  const { reference } = req.body;
  const user_id = req.user.id;
  if (!reference) return res.status(400).json({ message: 'Referência obrigatória.' });
  try {
    const count = await FavoriteModel.remove({ user_id, reference });
    if (count > 0) res.status(200).json({ message: 'Favorito removido.' });
    else res.status(404).json({ message: 'Favorito não encontrado.' });
  } catch (error) { res.status(500).json({ message: 'Erro ao remover favorito.' }); }
});

// --- ROTA DE BUSCA E NAVEGAÇÃO ---
router.post('/verse/search', async (req, res) => {
  const { book, chapter, verse, version } = req.body;
  if (!book || !chapter || !verse || !version) return res.status(400).json({ message: 'Dados incompletos.' });
  try {
    const apiUrl = `https://bible-api.com/${book.trim().replace(/\s+/g, '+')}+${chapter}:${verse}?translation=${version}`;
    const { ok, data: apiData } = await fetchAndParse(apiUrl);
    
    if (!ok || apiData.error) throw new Error(apiData.error || 'Versículo não encontrado na API externa.');
    
    const bookData = await BibleModel.findBookByAbbreviation(apiData.verses[0].book_id);
    if (!bookData) throw new Error('Inconsistência de dados: livro não encontrado.');

    const chapterData = await BibleModel.findChapter({ book_id: bookData.id, chapter_number: chapter });
    if (!chapterData) throw new Error(`Capítulo ${chapter} não encontrado em ${bookData.name}.`);
    
    let previousVerse = null, nextVerse = null;
    const currentVerseNum = parseInt(verse), currentChapterNum = parseInt(chapter);

    if (currentVerseNum > 1) {
      previousVerse = { book: bookData.name, chapter: currentChapterNum, verse: currentVerseNum - 1 };
    } else if (currentChapterNum > 1) {
      const prevChapterData = await BibleModel.findChapter({ book_id: bookData.id, chapter_number: currentChapterNum - 1 });
      previousVerse = { book: bookData.name, chapter: currentChapterNum - 1, verse: prevChapterData.total_verses };
    } else if (bookData.id > 1) {
      const prevBookData = await BibleModel.findPreviousBook(bookData.id);
      const lastChapterOfPrevBook = await BibleModel.findChapter({ book_id: prevBookData.id, chapter_number: prevBookData.total_chapters });
      previousVerse = { book: prevBookData.name, chapter: prevBookData.total_chapters, verse: lastChapterOfPrevBook.total_verses };
    }

    if (currentVerseNum < chapterData.total_verses) {
      nextVerse = { book: bookData.name, chapter: currentChapterNum, verse: currentVerseNum + 1 };
    } else if (currentChapterNum < bookData.total_chapters) {
      nextVerse = { book: bookData.name, chapter: currentChapterNum + 1, verse: 1 };
    } else {
      const nextBookData = await BibleModel.findNextBook(bookData.id);
      if (nextBookData) nextVerse = { book: nextBookData.name, chapter: 1, verse: 1 };
    }

    res.status(200).json({
      reference: apiData.reference,
      text: apiData.text || apiData.verses[0].text,
      version: apiData.translation_id,
      navigation: { previous: previousVerse, next: nextVerse },
    });
  } catch (error) { 
    console.error('Erro na rota /verse/search:', error.message);
    res.status(500).json({ message: error.message || 'Erro interno no servidor.' }); 
  }
});

module.exports = router;