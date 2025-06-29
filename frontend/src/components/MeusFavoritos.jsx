// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useState, useEffect, useContext } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function MeusFavoritos() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);
  const [favoritos, setFavoritos] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState('');

  useEffect(() => {
    const fetchFavoritos = async () => {
      if (!estado.token) {
        setErro("Você precisa estar logado para ver seus favoritos.");
        setCarregando(false);
        return;
      }
      setCarregando(true);
      try {
        const resposta = await fetch('/api/favorites', {
          headers: { 'Authorization': `Bearer ${estado.token}` }
        });
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os favoritos.');
        }
        const dados = await resposta.json();
        setFavoritos(dados);
      } catch (err) {
        setErro(err.message);
      } finally {
        setCarregando(false);
      }
    };

    fetchFavoritos();
  }, [estado.token]);

  const handleRemoverFavorito = async (reference) => {
    if (!estado.token) return;

    try {
      const resposta = await fetch('/api/favorites', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${estado.token}`
        },
        body: JSON.stringify({ reference })
      });

      if (!resposta.ok) {
        const erroData = await resposta.json();
        throw new Error(erroData.message || 'Não foi possível remover o favorito.');
      }
      
      // Atualiza o estado local da página e o estado global
      setFavoritos(favoritos.filter(fav => fav.reference !== reference));
      despachar({ type: 'REMOVE_FAVORITE', payload: { reference } });

    } catch (err) {
      console.error("Erro ao remover favorito:", err);
      alert(`Erro: ${err.message}`);
    }
  };

  if (carregando) {
    return <p>Carregando favoritos...</p>;
  }

  if (erro) {
    return <p className="mensagem-erro">{erro}</p>;
  }

  return (
    <div className="favoritos-container">
      <h2>Meus Versículos Favoritos</h2>
      {favoritos.length === 0 ? (
        <p>Você ainda não favoritou nenhum versículo.</p>
      ) : (
        <ul className="lista-favoritos">
          {favoritos.map(fav => (
            <li key={fav.id} className="item-favorito">
              <button 
                className="botao-remover-favorito" 
                title="Remover dos Favoritos"
                onClick={() => handleRemoverFavorito(fav.reference)}
              >
                × {/* Ícone de remover favorito */}
              </button>
              <p className="texto-biblico">"{fav.text}"</p>
              <p className="referencia-busca">({fav.reference}) - {fav.version}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default MeusFavoritos;