// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useContext } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function ControlesNavegacao() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);

  const isFavorito = estado.textoResultado && estado.favoritos.has(estado.textoResultado.reference);

  const buscarVersiculo = async (referencia) => {
    if (!referencia) return;

    despachar({ type: 'CARREGANDO_BUSCA', payload: true });
    despachar({ type: 'ERRO_BUSCA', payload: '' });

    try {
      const resposta = await fetch('/api/verse/search', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          book: referencia.book,
          chapter: referencia.chapter,
          verse: referencia.verse,
          version: estado.versao,
        }),
      });

      const dadosApi = await resposta.json();
      if (!resposta.ok) { throw new Error(dadosApi.message || 'Erro na busca.'); }
      
      const payloadCompleto = {
        ...dadosApi,
        navigation: {
          ...dadosApi.navigation,
          current: { ...referencia },
        },
      };
      despachar({ type: 'DEFINIR_RESULTADO', payload: payloadCompleto });
    } catch (erro) {
      console.error("Erro na navegação de versículo:", erro);
      despachar({ type: 'ERRO_BUSCA', payload: `Erro: ${erro.message}` });
    }
  };
  
  const handleToggleFavorito = async () => {
    if (!estado.textoResultado || !estado.token) return;

    const { reference, text } = estado.textoResultado;
    const { versao } = estado;
    
    const method = isFavorito ? 'DELETE' : 'POST';

    try {
      const resposta = await fetch('/api/favorites', {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${estado.token}`
        },
        body: JSON.stringify({ reference, text, version: versao }) // 'text' e 'version' só são necessários para POST
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
      console.error('Erro ao favoritar/desfavoritar:', error);
      alert(`Erro: ${error.message}`);
    }
  };
  
  return (
    <div className="controles-navegacao-container">
      <button 
        title="Versículo Anterior" 
        onClick={() => buscarVersiculo(estado.textoResultado?.navigation.previous)}
        disabled={!estado.textoResultado?.navigation.previous || estado.carregandoBusca}
      >
        {'<'}
      </button>
      <button 
        title="Próximo Versículo" 
        onClick={() => buscarVersiculo(estado.textoResultado?.navigation.next)}
        disabled={!estado.textoResultado?.navigation.next || estado.carregandoBusca}
      >
        {'>'}
      </button>
      {estado.usuario && (
        <button 
          title={isFavorito ? "Remover dos Favoritos" : "Favoritar Versículo"} 
          onClick={handleToggleFavorito}
          className={isFavorito ? 'favoritado' : ''}
        >
          {isFavorito ? 'Favorito ★' : 'Favoritar ☆'}
        </button>
      )}
    </div>
  );
}

export default ControlesNavegacao;