// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
const winston = require('winston');

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json()
  ),
  transports: [
    // Salva logs de erro em um arquivo 'error.log'
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    // Salva todos os logs em um arquivo 'combined.log'
    new winston.transports.File({ filename: 'combined.log' }),
  ],
});

// Se não estivermos em produção, também logar no console
if (process.env.NODE_ENV !== 'production') {
  logger.add(new winston.transports.Console({
    format: winston.format.simple(),
  }));
}

module.exports = logger;