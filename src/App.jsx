// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765

import React from 'react';
import './App.css';
import { EstadoBibliaProvider } from './contexts/EstadoBibliaContexto';
import PaginaPrincipal from './components/PaginaPrincipal';
import ControlesIdioma from './components/ControlesIdioma';
import FormularioPesquisa from './components/FormularioPesquisa';
import ResultadoTexto from './components/ResultadoTexto';
import SugestaoLeitura from './components/SugestaoLeitura';

function App() {
  return (
    <EstadoBibliaProvider>
      <div className="aplicacao-container">
        <PaginaPrincipal />
        <main className="conteudo-principal">
          <ControlesIdioma />
          <hr className="divisor" />
          <FormularioPesquisa />
          <ResultadoTexto />
          <hr className="divisor" />
          <SugestaoLeitura />
        </main>
        <footer className="rodape">
          <p>© {new Date().getFullYear()} Refrigério da Palavra. Desenvolvido por Álison Carvalho.</p>
        </footer>
      </div>
    </EstadoBibliaProvider>
  );
}

export default App;