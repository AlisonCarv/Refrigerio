// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import './App.css';
import { EstadoBibliaProvider } from './contexts/EstadoBibliaContexto';

// Componentes estruturais e de página
import Header from './components/Header';
import PaginaDeBusca from './components/PaginaDeBusca';
import MeusFavoritos from './components/MeusFavoritos'; // Importar a nova página

function App() {
  return (
    <EstadoBibliaProvider>
      <div className="aplicacao-container">
        <Header /> {/* Renderiza o cabeçalho com título e login */}
        
        <main>
          <Routes>
            <Route path="/" element={<PaginaDeBusca />} />
            <Route path="/favoritos" element={<MeusFavoritos />} /> {/* Adicionar a rota para favoritos */}
          </Routes>
        </main>

        <footer className="rodape">
          <p>© {new Date().getFullYear()} Refrigério da Palavra. Desenvolvido por Álison Carvalho.</p>
        </footer>
      </div>
    </EstadoBibliaProvider>
  );
}

export default App;