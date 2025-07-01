// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const https = require('https'); // Módulo para criar servidor HTTPS
const fs = require('fs'); // Módulo para ler arquivos do sistema
const path = require('path');
const express = require('express');
const cors = require('cors');
const compression = require('compression');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const xss = require('express-xss-sanitizer');
const { errors } = require('celebrate');
const logger = require('./src/config/logger');

const authRoutes = require('./src/routes/authRoutes');
const bibleRoutes = require('./src/routes/bibleRoutes');

const app = express();

// --- MIDDLEWARES DE SEGURANÇA E OTIMIZAÇÃO ---
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: 'Muitas requisições deste IP, por favor tente novamente em 15 minutos.',
});
app.use(limiter);

app.use(cors());
app.use(express.json());
app.use(compression());
app.use(xss());
app.use(morgan('dev', { stream: { write: (message) => logger.info(message.trim()) } }));

// --- ROTAS ---
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao backend do projeto Refrigério!' });
});
app.use('/api', authRoutes);
app.use('/api', bibleRoutes);

// --- TRATAMENTO DE ERROS ---
app.use(errors());
app.use((err, req, res, next) => {
  logger.error(`${err.status || 500} - ${err.message} - ${req.originalUrl} - ${req.method} - ${req.ip}`);
  res.status(err.status || 500).json({ message: err.message || 'Erro interno no servidor.' });
});

// --- CONFIGURAÇÃO DO SERVIDOR HTTPS ---
const PORT = process.env.PORT || 3001;

// Carrega os arquivos de chave e certificado
const sslOptions = {
  key: fs.readFileSync(path.join(__dirname, 'src/config/key.pem')),
  cert: fs.readFileSync(path.join(__dirname, 'src/config/cert.pem'))
};

// Cria e inicia o servidor HTTPS em vez de HTTP
https.createServer(sslOptions, app).listen(PORT, () => {
  logger.info(`Servidor backend SEGURO (HTTPS) rodando na porta ${PORT}`);
});