// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const jwt = require('jsonwebtoken');

const protect = (req, res, next) => {
  let token;
  
  // O token será enviado no cabeçalho Authorization como "Bearer <token>"
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Pega o token da string "Bearer <token>"
      token = req.headers.authorization.split(' ')[1];

      // É ESSENCIAL usar uma chave secreta segura e guardá-la em variáveis de ambiente em um projeto real.
      // Por simplicidade do projeto, usaremos a mesma string do arquivo de rotas.
      const secretKey = 'sua-chave-secreta-muito-segura-e-dificil';

      // Verifica e decodifica o token
      const decoded = jwt.verify(token, secretKey);

      // Adiciona o usuário do payload do token ao objeto req, para que as rotas subsequentes possam usá-lo
      req.user = decoded; // teremos req.user.id, req.user.username

      next(); // Passa para a próxima função na cadeia (a rota real)
    } catch (error) {
      console.error('Erro na autenticação do token', error);
      res.status(401).json({ message: 'Não autorizado, token falhou.' });
    }
  }

  if (!token) {
    res.status(401).json({ message: 'Não autorizado, sem token.' });
  }
};

module.exports = { protect };