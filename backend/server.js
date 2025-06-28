const express = require('express');
const cors = require('cors');
const authRoutes = require('./src/routes/authRoutes');
const bibleRoutes = require('./src/routes/bibleRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Rota de teste (pode manter ou remover)
app.get('/', (req, res) => {
  res.json({ message: 'Bem-vindo ao backend do projeto Refrigério!' });
});

// Usar as rotas de autenticação
app.use('/api', authRoutes);
app.use('/api', bibleRoutes);

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Servidor backend rodando na porta ${PORT}`);
});