// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { celebrate, Joi, Segments } = require('celebrate'); // IMPORTAR
const UserModel = require('../models/user.model');

const router = express.Router();

// Validação para a rota de login
const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

router.post('/login', loginValidation, async (req, res, next) => { // Adicionar next para o error handler
  const { username, password } = req.body;
  // A validação do celebrate já garante que os campos existem
  try {
    const user = await UserModel.findByUsername(username);
    if (!user) return res.status(401).json({ message: 'Credenciais inválidas.' });
    
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) return res.status(401).json({ message: 'Credenciais inválidas.' });

    const payload = { id: user.id, username: user.username };
    const secretKey = 'sua-chave-secreta-muito-segura-e-dificil'; 
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      usuario: { id: user.id, nome: user.nome },
    });
  } catch (error) {
    next(error); // Passa o erro para o middleware de tratamento de erro
  }
});

module.exports = router;