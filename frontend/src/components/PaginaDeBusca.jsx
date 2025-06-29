// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React from 'react';
import ControlesIdioma from './ControlesIdioma';
import FormularioPesquisa from './FormularioPesquisa';
import ResultadoTexto from './ResultadoTexto';
import SugestaoLeitura from './SugestaoLeitura';

// Este componente agrupa a funcionalidade principal de busca
function PaginaDeBusca() {
  return (
    <>  
      <ControlesIdioma />
      <hr className="divisor" />
      <FormularioPesquisa />
      <ResultadoTexto />
      <hr className="divisor" />
      <SugestaoLeitura />
    </>
  );
}

export default PaginaDeBusca;