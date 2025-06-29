// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const cors = require('cors');
const compression = require('compression'); // IMPORTAR
const authRoutes = require('./src/routes/authRoutes');
const bibleRoutes = require('./src/routes/bibleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(compression()); // ADICIONAR: Comprime todas as respostas

app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao backend do projeto Refrigério!' });
});

app.use('/api', authRoutes);
app.use('/api', bibleRoutes);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});