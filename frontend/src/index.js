// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import './App.css';
import App from './App';

const elementoRaiz = ReactDOM.createRoot(document.getElementById('root'));
elementoRaiz.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);