// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765

import React, { createContext, useReducer } from 'react';

const estadoInicial = {
  idioma: 'pt-BR',
  versao: 'almeida',
  livroBuscadoContexto: '',
  capituloBuscadoContexto: '',
  versiculoBuscadoContexto: '',
  textoResultado: null,
  sugestao: null,
  erroBusca: '',
  erroSugestao: '',
  carregandoBusca: false,
  carregandoSugestao: false,
};

function redutorBiblia(estado, acao) {

  switch (acao.type) {
    
    case 'DEFINIR_IDIOMA_VERSAO':
      const novoEstadoIdioma = {
        ...estado,
        idioma: acao.payload.idioma,
        versao: acao.payload.versao,
        livroBuscadoContexto: '',
        capituloBuscadoContexto: '',
        versiculoBuscadoContexto: '',
        textoResultado: null,
        erroBusca: '',
      };

      return novoEstadoIdioma;

    case 'CARREGANDO_BUSCA':
      return { ...estado, carregandoBusca: acao.payload, erroBusca: '', textoResultado: null };

    case 'DEFINIR_RESULTADO':
      if (!acao.payload) {
          return { ...estado, textoResultado: null, carregandoBusca: false, erroBusca: '' };
      }
      return {
          ...estado,
          textoResultado: { text: acao.payload.text, reference: acao.payload.reference },
          livroBuscadoContexto: acao.payload.livro,
          capituloBuscadoContexto: acao.payload.capitulo,
          versiculoBuscadoContexto: acao.payload.versiculo,
          carregandoBusca: false,
          erroBusca: '',
      };

    case 'ERRO_BUSCA':
      return { ...estado, erroBusca: acao.payload, carregandoBusca: false, textoResultado: null };

    case 'CARREGANDO_SUGESTAO':
      return { ...estado, carregandoSugestao: acao.payload, erroSugestao: '' };

    case 'DEFINIR_SUGESTAO':
      return { ...estado, sugestao: acao.payload, carregandoSugestao: false, erroSugestao: '' };

    case 'ERRO_SUGESTAO':
      return { ...estado, erroSugestao: acao.payload, carregandoSugestao: false, sugestao: null };

    default:
      return estado;
  }
}

export const EstadoBibliaContexto = createContext();

export function EstadoBibliaProvider({ children }) {
  const [estado, despachar] = useReducer(redutorBiblia, estadoInicial);

  return (
    <EstadoBibliaContexto.Provider value={{ estado, despachar }}>
      {children}
    </EstadoBibliaContexto.Provider>
  );
}