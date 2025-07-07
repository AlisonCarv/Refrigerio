// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { celebrate, Joi, Segments } = require('celebrate');
const UserModel = require('../models/user.model');
const logger = require('../config/logger');

const router = express.Router();

// Validação para a rota de login
const loginValidation = celebrate({
  [Segments.BODY]: Joi.object().keys({
    username: Joi.string().required(),
    password: Joi.string().required(),
  }),
});

router.post('/login', loginValidation, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await UserModel.findByUsername(username);

    // Comparar a senha
    const isPasswordCorrect = user && (await bcrypt.compare(password, user.password));

    if (!isPasswordCorrect) {
      // LOG ESPECÍFICO DE FALHA DE AUTENTICAÇÃO
      logger.warn(`Falha de login para o usuário: "${username}" do IP: ${req.ip}`);
      return res.status(401).json({ message: 'Credenciais inválidas.' });
    }

    // Se a senha estiver correta, criar um Token JWT
    const payload = {
      id: user.id,
      username: user.username,
    };
    
    const secretKey = 'sua-chave-secreta-muito-segura-e-dificil'; 
    const token = jwt.sign(payload, secretKey, { expiresIn: '1h' });
    
    // LOG ESPECÍFICO DE SUCESSO DE AUTENTICAÇÃO
    logger.info(`Usuário '${user.username}' (ID: ${user.id}) logado com sucesso.`);
    
    res.status(200).json({
      message: 'Login bem-sucedido!',
      token: token,
      usuario: { id: user.id, nome: user.nome },
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;