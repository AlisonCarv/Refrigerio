// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';
import PaginaPrincipal from './PaginaPrincipal';
import Login from './Login';

function Header() {
  const { estado } = useContext(EstadoBibliaContexto);
  return (
    <header className="cabecalho-container">
      <div className="titulo-container">
        <PaginaPrincipal />
        {/* Adiciona link para Início e Favoritos se o usuário estiver logado */}
        {estado.usuario && (
          <nav className="nav-principal">
            <Link to="/">Início</Link>
            <Link to="/favoritos">Meus Favoritos</Link>
          </nav>
        )}
      </div>
      <Login />
    </header>
  );
}

export default Header;