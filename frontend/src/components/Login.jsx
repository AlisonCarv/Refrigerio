// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useState, useContext } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function Login() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const resposta = await fetch('/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      const dados = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao fazer login');
      }
      
      despachar({ type: 'LOGIN_SUCCESS', payload: { usuario: dados.usuario, token: dados.token } });
      localStorage.setItem('token', dados.token);
      localStorage.setItem('usuario', JSON.stringify(dados.usuario));

      // Buscar favoritos após o login
      const favResponse = await fetch('/api/favorites', {
        headers: { 'Authorization': `Bearer ${dados.token}` }
      });
      const favData = await favResponse.json();
      if (favResponse.ok) {
        despachar({ type: 'SET_FAVORITES', payload: favData });
      }

    } catch (err) {
      setError(err.message);
    }
  };

  const handleLogout = () => {
    despachar({ type: 'LOGOUT' });
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
  };

  if (estado.usuario) {
    return (
      <div className="area-logada">
        <p>Bem-vindo, {estado.usuario.nome}!</p>
        <button onClick={handleLogout}>Sair</button>
      </div>
    );
  }

  return (
    <div className="area-login">
      <h3>Login</h3>
      <form onSubmit={handleLogin}>
        <input 
          type="text" 
          placeholder="Usuário" 
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required 
        />
        <input 
          type="password" 
          placeholder="Senha" 
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required 
        />
        <button type="submit">Entrar</button>
        {error && <p className="mensagem-erro">{error}</p>}
      </form>
    </div>
  );
}

export default Login;