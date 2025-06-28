// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useEffect, useContext, useCallback } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function SugestaoLeitura() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);
  
  const referenciaSugestao = estado.sugestao ? `${estado.sugestao.book} ${estado.sugestao.chapter}:${estado.sugestao.verse}` : '';
  const isFavorito = estado.favoritos.has(referenciaSugestao);

  const buscarSugestao = useCallback(async (versaoParaBuscar) => {
    if (!versaoParaBuscar) return;

    despachar({ type: 'CARREGANDO_SUGESTAO', payload: true });
    despachar({ type: 'ERRO_SUGESTAO', payload: '' });
    despachar({ type: 'DEFINIR_SUGESTAO', payload: null });

    try {
      const resposta = await fetch(`/api/suggestion/${versaoParaBuscar}`);
      const dados = await resposta.json();

      if (!resposta.ok) {
        throw new Error(dados.message || 'Erro ao buscar sugestão.');
      }
      
      if (dados && dados.text) {
        despachar({
            type: 'DEFINIR_SUGESTAO',
            payload: { text: dados.text.trim(), book: dados.book, chapter: dados.chapter, verse: dados.verse },
        });
      } else {
        throw new Error('Sugestão não encontrada ou formato de resposta inesperado.');
      }
    } catch (erro) {
      console.error("Erro no bloco catch ao buscar sugestão:", erro);
      despachar({ type: 'ERRO_SUGESTAO', payload: erro.message });
    }
  }, [despachar]);

  useEffect(() => {
    if (estado.versao) {
      buscarSugestao(estado.versao);
    }
  }, [estado.versao, buscarSugestao]);

  const handleToggleFavorito = async () => {
    if (!estado.sugestao || !estado.token) return;

    const { text, book, chapter, verse } = estado.sugestao;
    const reference = `${book} ${chapter}:${verse}`;
    const method = isFavorito ? 'DELETE' : 'POST';

    try {
      const resposta = await fetch('/api/favorites', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${estado.token}`
        },
        body: JSON.stringify({ reference, text, version: estado.versao })
      });

      if (!resposta.ok) {
        const erro = await resposta.json();
        throw new Error(erro.message || 'Não foi possível atualizar o favorito.');
      }
      
      if (isFavorito) {
        despachar({ type: 'REMOVE_FAVORITE', payload: { reference } });
      } else {
        despachar({ type: 'ADD_FAVORITE', payload: { reference } });
      }
    } catch (error) {
      console.error('Erro ao favoritar/desfavoritar sugestão:', error);
      alert(`Erro: ${error.message}`);
    }
  };
  
  return (
    <div className="sugestao-leitura-container">
      <h2>Sugestão de Leitura</h2>
      
      {estado.usuario && estado.sugestao && (
        <span 
          className={`favorito-sugestao ${isFavorito ? 'favoritado' : ''}`}
          title={isFavorito ? "Remover dos Favoritos" : "Favoritar Sugestão"}
          onClick={handleToggleFavorito}
        >
          {isFavorito ? '★' : '☆'}
        </span>
      )}
      
      {estado.carregandoSugestao && <p>Carregando sugestão...</p>}
      {estado.erroSugestao && !estado.carregandoSugestao && <p className="mensagem-erro">{estado.erroSugestao}</p>}
      
      {estado.sugestao && !estado.carregandoSugestao && !estado.erroSugestao && (
        <>
          <p className="texto-biblico">"{estado.sugestao.text}"</p>
          <p className="referencia-sugestao">
            ({referenciaSugestao})
          </p>
        </>
      )}
    </div>
  );
}

export default SugestaoLeitura;