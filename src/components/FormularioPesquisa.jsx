// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765

// Biblioteca externa utilizada: react-hook-form
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function FormularioPesquisa() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const onSubmit = async (data) => {
    despachar({ type: 'ERRO_BUSCA', payload: '' });
    despachar({ type: 'DEFINIR_RESULTADO', payload: null });

    const livroFormatado = data.livro.trim().replace(/\s+/g, '+');
    const capituloFormatado = data.capitulo.trim();
    const versiculoFormatado = data.versiculo.trim();

    const url = `https://bible-api.com/${livroFormatado}+${capituloFormatado}:${versiculoFormatado}?translation=${estado.versao}`;

    despachar({ type: 'CARREGANDO_BUSCA', payload: true });
    try {
      const resposta = await fetch(url);
      const dadosApi = await resposta.json();

      if (dadosApi.error) {
        throw new Error(dadosApi.error);
      }

      let textoEncontrado = null;
      let referenciaDaApi = dadosApi.reference || `${data.livro} ${data.capitulo}:${data.versiculo}`;
      let livroDaApi = data.livro;
      let capituloDaApi = data.capitulo;
      let versiculoDaApi = data.versiculo;


      if (dadosApi.verses && dadosApi.verses.length > 0 && typeof dadosApi.verses[0].text === 'string') {
        textoEncontrado = dadosApi.verses[0].text.trim();
        livroDaApi = dadosApi.verses[0].book_name || livroDaApi;
        capituloDaApi = (dadosApi.verses[0].chapter || capituloDaApi).toString();
        versiculoDaApi = (dadosApi.verses[0].verse || versiculoDaApi).toString();
      } else if (typeof dadosApi.text === 'string' && dadosApi.text.trim() !== '') {
        textoEncontrado = dadosApi.text.trim();
      }


      if (textoEncontrado) {
        despachar({
          type: 'DEFINIR_RESULTADO',
          payload: {
            text: textoEncontrado,
            reference: referenciaDaApi,
            livro: livroDaApi,
            capitulo: capituloDaApi,
            versiculo: versiculoDaApi,
          },
        });
        reset();
      } else {
        console.warn("API não retornou texto no formato esperado, ou versículo não existe:", dadosApi);
        despachar({ type: 'ERRO_BUSCA', payload: 'Versículo não encontrado ou resposta inesperada da API. Verifique os dados digitados (ex: João 3:16).' });
      }
    } catch (erro) {
      console.error("Erro no bloco catch ao buscar versículo:", erro);
      despachar({ type: 'ERRO_BUSCA', payload: `Erro: ${erro.message}. Verifique os dados e tente novamente.` });
    }
  };

  return (
    <div className="formulario-pesquisa-container">
      <h2>Buscar Versículo</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="formulario-pesquisa">
        <div className="campo-formulario">
          <label htmlFor="livro-input">Livro:</label>
          <input
            id="livro-input"
            type="text"
            placeholder="Ex: João"
            {...register('livro', { required: 'Livro é obrigatório' })}
          />
          {errors.livro && <p className="mensagem-erro">{errors.livro.message}</p>}
        </div>

        <div className="campo-formulario">
          <label htmlFor="capitulo-input">Capítulo:</label>
          <input
            id="capitulo-input"
            type="text"
            placeholder="Ex: 3"
            {...register('capitulo', {
              required: 'Capítulo é obrigatório',
              pattern: { value: /^[0-9]+$/, message: 'Capítulo deve ser um número' }
            })}
          />
          {errors.capitulo && <p className="mensagem-erro">{errors.capitulo.message}</p>}
        </div>

        <div className="campo-formulario">
          <label htmlFor="versiculo-input">Versículo:</label>
          <input
            id="versiculo-input"
            type="text"
            placeholder="Ex: 16"
            {...register('versiculo', {
              required: 'Versículo é obrigatório',
              pattern: { value: /^[0-9]+$/, message: 'Versículo deve ser um número' }
            })}
          />
          {errors.versiculo && <p className="mensagem-erro">{errors.versiculo.message}</p>}
        </div>
        
        <button type="submit" disabled={estado.carregandoBusca}>
          {estado.carregandoBusca ? 'Buscando...' : 'Buscar'}
        </button>
      </form>
    </div>
  );
}

export default FormularioPesquisa;