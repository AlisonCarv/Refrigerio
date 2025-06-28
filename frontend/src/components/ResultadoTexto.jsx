// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useContext } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';
import ControlesNavegacao from './ControlesNavegacao'; // Vamos criar

function ResultadoTexto() {
  const { estado } = useContext(EstadoBibliaContexto);

  if (estado.carregandoBusca) {
    return (
      <div className="resultado-container">
        <p>Buscando versículo...</p>
      </div>
    );
  }

  if (estado.erroBusca) {
    return (
      <div className="resultado-container erro">
        <h3>Erro na Busca:</h3>
        <p>{estado.erroBusca}</p>
      </div>
    );
  }

  if (!estado.textoResultado || !estado.textoResultado.text) {
    return null;
  }

  return (
    <div className="resultado-container">
      <h3>Resultado da Busca:</h3>
      <p className="texto-biblico">"{estado.textoResultado.text}"</p>
      <p className="referencia-busca">({estado.textoResultado.reference})</p>
      <ControlesNavegacao /> {/* Botões de ação para o versículo atual */}
    </div>
  );
}

export default ResultadoTexto;