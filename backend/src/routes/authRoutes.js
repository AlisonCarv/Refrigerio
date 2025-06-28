const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db'); // Importa nossa conexão com o banco

const router = express.Router();

// Rota POST para /api/login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  // Validação básica de entrada
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }

  try {
    // 1. Encontrar o usuário no banco de dados
    const user = await db('users').where({ username: username }).first();

    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' }); // 401 Unauthorized
    }

    // 2. Comparar a senha fornecida com a senha criptografada no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // 3. Se a senha estiver correta, criar um Token JWT
    const payload = {
      id: user.id,
      username: user.username,
    };

    // É ESSENCIAL usar uma chave secreta segura e guardá-la em variáveis de ambiente em um projeto real.
    // Por simplicidade do projeto, usaremos uma string aqui.
    const secretKey = 'sua-chave-secreta-muito-segura-e-dificil'; 

    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' }); // Token expira em 1 hora

    // 4. Enviar a resposta de sucesso
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      usuario: {
        id: user.id,
        nome: user.nome,
      },
    });

  } catch (error) {
    console.error('Erro no servidor durante o login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;