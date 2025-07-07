// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const { celebrate, Joi, Segments } = require('celebrate');
const mcache = require('memory-cache'); // Para o Cache
const logger = require('../config/logger'); // Para o Monitoramento
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

// Middleware de Cache explícito
const cacheMiddleware = (duration) => (req, res, next) => {
  const key = '__express__' + req.originalUrl || req.url;
  const cachedBody = mcache.get(key);
  if (cachedBody) {
    logger.info(`Servindo sugestão para "${req.params.version}" do cache.`);
    res.send(cachedBody);
    return;
  }
  res.sendResponse = res.send;
  res.send = (body) => {
    mcache.put(key, body, duration * 1000);
    res.sendResponse(body);
  };
  next();
};

// --- ROTA DE SUGESTÃO (PÚBLICA) ---
router.get('/suggestion/:version', cacheMiddleware(300), async (req, res, next) => {
  try {
    const { version } = req.params;
    const apiUrl = `https://bible-api.com/data/${version}/random`;
    const { ok, data } = await fetchAndParse(apiUrl);
    if (!ok || data.error) throw new Error(data.error || 'Não foi possível obter a sugestão.');
    if (data.random_verse) res.status(200).json(data.random_verse);
    else res.status(404).json({ message: 'Sugestão não encontrada.' });
  } catch (error) { next(error); }
});

// --- ROTAS DE FAVORITOS (PROTEGIDAS) ---
const favoriteValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    reference: Joi.string().required(),
    text: Joi.string().required(),
    version: Joi.string().required(),
  }),
});
router.post('/favorites', protect, favoriteValidation, async (req, res, next) => {
  try {
    const { reference, text, version } = req.body;
    const user_id = req.user.id;
    const existing = await FavoriteModel.findOne({ user_id, reference });
    if (existing) return res.status(200).json({ message: 'Já favoritado.', favorite: existing });
    await FavoriteModel.create({ user_id, reference, text, version });
    // Log de Inserção (Postagem)
    logger.info(`Usuário ID: ${user_id} favoritou o versículo: '${reference}'`);
    res.status(201).json({ message: 'Favoritado com sucesso.' });
  } catch (error) { next(error); }
});

router.get('/favorites', protect, async (req, res, next) => {
  try {
    const favorites = await FavoriteModel.findByUser(req.user.id);
    res.status(200).json(favorites);
  } catch (error) { next(error); }
});

const deleteFavoriteValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({ reference: Joi.string().required() })
});
router.delete('/favorites', protect, deleteFavoriteValidation, async (req, res, next) => {
  try {
    const { reference } = req.body;
    const user_id = req.user.id;
    const count = await FavoriteModel.remove({ user_id, reference });
    if (count > 0) res.status(200).json({ message: 'Favorito removido.' });
    else res.status(404).json({ message: 'Favorito não encontrado.' });
  } catch (error) { next(error); }
});

// --- ROTA DE BUSCA E NAVEGAÇÃO ---
const searchValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    book: Joi.string().required(),
    chapter: Joi.alternatives().try(Joi.string().pattern(/^[0-9]+$/), Joi.number()).required(),
    verse: Joi.alternatives().try(Joi.string().pattern(/^[0-9]+$/), Joi.number()).required(),
    version: Joi.string().required(),
  }),
});
router.post('/verse/search', searchValidation, async (req, res, next) => {
  try {
    const { book, chapter, verse, version } = req.body;
    // Log de Busca
    logger.info(`Busca realizada para: Livro=${book}, Cap=${chapter}, Vers=${verse}`);
    
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
    next(error); 
  }
});

module.exports = router;