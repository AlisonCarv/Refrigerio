const bcrypt = require('bcryptjs');

exports.seed = async function(knex) {
  // Deleta entradas existentes
  await knex('users').del();
  
  // Criptografa a senha 'admin'
  const hashedPassword = await bcrypt.hash('admin', 10); // 10 é o "salt rounds"

  // Insere o usuário admin
  await knex('users').insert([
    { 
      nome: 'Admin', 
      username: 'admin', 
      password: hashedPassword 
    }
  ]);
};