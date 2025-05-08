// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765

import React, { useEffect, useContext, useCallback } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function SugestaoLeitura() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);

  const buscarSugestao = useCallback(async (versaoParaBuscar) => {
    if (!versaoParaBuscar) return;

    despachar({ type: 'CARREGANDO_SUGESTAO', payload: true });
    despachar({ type: 'ERRO_SUGESTAO', payload: '' });
    despachar({ type: 'DEFINIR_SUGESTAO', payload: null });

    // API Parameterized para versos aleatórios
    const url = `https://bible-api.com/data/${versaoParaBuscar}/random`;

    try {
      const resposta = await fetch(url);
      const dados = await resposta.json();

      if (!resposta.ok) {
          throw new Error(dados.error || `Erro na requisição da sugestão: ${resposta.statusText}`);
      }
      
      if (dados.random_verse && dados.random_verse.text) {
          const { text, book, chapter, verse } = dados.random_verse;
          despachar({
              type: 'DEFINIR_SUGESTAO',
              payload: { text: text.trim(), book, chapter, verse },
          });
      } else {

          console.warn("API não retornou sugestão no formato esperado:", dados);
          throw new Error('Sugestão não encontrada ou formato de resposta inesperado.');
      }

    } catch (erro) {
      console.error("Erro no bloco catch ao buscar sugestão:", erro);
      despachar({ type: 'ERRO_SUGESTAO', payload: erro.message || 'Erro ao buscar sugestão.' });
    }
  }, [despachar]);

  useEffect(() => {

    if (estado.versao) {
        buscarSugestao(estado.versao);
    }
  }, [estado.versao, buscarSugestao]);

  return (
    <div className="sugestao-leitura-container">
      <h2>Sugestão de Leitura</h2>
      {estado.carregandoSugestao && <p>Carregando sugestão...</p>}
      {estado.erroSugestao && !estado.carregandoSugestao && 
        <p className="mensagem-erro">{estado.erroSugestao}</p>
      }
      {estado.sugestao && !estado.carregandoSugestao && !estado.erroSugestao && (
        <>
          <p className="texto-biblico">"{estado.sugestao.text}"</p>
          <p className="referencia-sugestao">
            ({estado.sugestao.book} {estado.sugestao.chapter}:{estado.sugestao.verse})
          </p>
        </>
      )}
      {!estado.sugestao && !estado.carregandoSugestao && !estado.erroSugestao && (

        <p>Selecione um idioma para ver uma sugestão.</p> 
      )}
    </div>
  );
}

export default SugestaoLeitura;