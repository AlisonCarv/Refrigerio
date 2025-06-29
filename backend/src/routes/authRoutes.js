// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const UserModel = require('../models/user.model'); // IMPORTAR O MODELO

const router = express.Router();

router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Usuário e senha são obrigatórios.' });
  }
  try {
    const user = await UserModel.findByUsername(username); // USAR O MODELO
    if (!user) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }
    const payload = { id: user.id, username: user.username };
    const secretKey = 'sua-chave-secreta-muito-segura-e-dificil'; 
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      usuario: { id: user.id, nome: user.nome },
    });
  } catch (error) {
    console.error('Erro no servidor durante o login:', error);
    res.status(500).json({ message: 'Erro interno no servidor.' });
  }
});

module.exports = router;