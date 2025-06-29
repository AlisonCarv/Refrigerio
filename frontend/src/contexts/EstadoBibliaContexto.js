// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { createContext, useReducer, useEffect } from 'react';

const estadoInicial = {
  carregandoSessao: true,
  usuario: null,
  token: null,
  favoritos: new Set(),
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
    case 'SESSAO_CARREGADA':
      return { ...estado, carregandoSessao: false };
    case 'LOGIN_SUCCESS':
      return { ...estado, usuario: acao.payload.usuario, token: acao.payload.token };
    case 'LOGOUT':
      return { ...estado, usuario: null, token: null, favoritos: new Set() };
    case 'SET_FAVORITES':
      const favoriteSet = new Set(acao.payload.map(fav => fav.reference));
      return { ...estado, favoritos: favoriteSet };
    case 'ADD_FAVORITE':
      const newFavoritesAdd = new Set(estado.favoritos);
      newFavoritesAdd.add(acao.payload.reference);
      return { ...estado, favoritos: newFavoritesAdd };
    case 'REMOVE_FAVORITE':
      const newFavoritesRemove = new Set(estado.favoritos);
      newFavoritesRemove.delete(acao.payload.reference);
      return { ...estado, favoritos: newFavoritesRemove };
    case 'DEFINIR_IDIOMA_VERSAO':
      return {
        ...estado,
        idioma: acao.payload.idioma,
        versao: acao.payload.versao,
        textoResultado: null,
        erroBusca: '',
      };
    case 'CARREGANDO_BUSCA':
      return { ...estado, carregandoBusca: acao.payload, erroBusca: '', textoResultado: null };
    case 'DEFINIR_RESULTADO':
      if (!acao.payload) { return { ...estado, textoResultado: null, carregandoBusca: false, erroBusca: '' }; }
      return {
        ...estado,
        textoResultado: { 
          text: acao.payload.text, 
          reference: acao.payload.reference,
          navigation: acao.payload.navigation,
        },
        livroBuscadoContexto: acao.payload.navigation.current.book,
        capituloBuscadoContexto: acao.payload.navigation.current.chapter.toString(),
        versiculoBuscadoContexto: acao.payload.navigation.current.verse.toString(),
        carregandoBusca: false,
        erroBusca: '',
      };
    case 'ERRO_BUSCA':
      return { ...estado, erroBusca: acao.payload, carregandoBusca: false, textoResultado: null };
    case 'CARREGANDO_SUGESTAO':
      return { ...estado, carregandoSugestao: acao.payload, erroSugestao: '' };
    case 'DEFINIR_SUGESTAO':
      // A sugestão é um objeto que também armazena sua versão
      return { 
        ...estado, 
        sugestao: { 
          ...acao.payload.sugestao,
          version: acao.payload.version, // Armazena a versão da sugestão
        },
        carregandoSugestao: false, 
        erroSugestao: '' 
      };
    case 'ERRO_SUGESTAO':
      return { ...estado, erroSugestao: acao.payload, carregandoSugestao: false, sugestao: null };
    default:
      return estado;
  }
}

export const EstadoBibliaContexto = createContext();

export function EstadoBibliaProvider({ children }) {
  const [estado, despachar] = useReducer(redutorBiblia, estadoInicial);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const usuarioJSON = localStorage.getItem('usuario');
    if (token && usuarioJSON) {
      try {
        const usuario = JSON.parse(usuarioJSON);
        despachar({ type: 'LOGIN_SUCCESS', payload: { usuario, token } });
        fetch('/api/favorites', { headers: { 'Authorization': `Bearer ${token}` } })
          .then(res => res.ok ? res.json() : [])
          .then(data => despachar({ type: 'SET_FAVORITES', payload: data }))
          .catch(err => console.error("Erro ao buscar favoritos iniciais:", err));
      } catch (e) {
        console.error("Erro ao carregar dados do usuário:", e);
        localStorage.clear();
      }
    }
    despachar({ type: 'SESSAO_CARREGADA' }); 
  }, []);

  return (
    <EstadoBibliaContexto.Provider value={{ estado, despachar }}>
      {children}
    </EstadoBibliaContexto.Provider>
  );
}