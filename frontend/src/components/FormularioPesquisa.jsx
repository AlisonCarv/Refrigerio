// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765
import React, { useContext } from 'react';
import { useForm } from 'react-hook-form';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function FormularioPesquisa() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  // Função reutilizável para buscar um versículo, usada tanto pelo formulário quanto pela navegação
  const buscarVersiculo = async (busca) => {
    despachar({ type: 'CARREGANDO_BUSCA', payload: true });
    despachar({ type: 'ERRO_BUSCA', payload: '' });
    
    try {
      const resposta = await fetch('/api/verse/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          book: busca.livro,
          chapter: busca.capitulo,
          verse: busca.versiculo,
          version: estado.versao,
        }),
      });

      const dadosApi = await resposta.json();
      if (!resposta.ok) {
        throw new Error(dadosApi.message || 'Erro na busca.');
      }
      
      // Adiciona a referência da busca atual ao payload para o contexto
      const payloadCompleto = {
        ...dadosApi,
        navigation: {
          ...dadosApi.navigation,
          current: {
            book: busca.livro,
            chapter: busca.capitulo,
            verse: busca.versiculo,
          },
        },
      };

      despachar({ type: 'DEFINIR_RESULTADO', payload: payloadCompleto });
    } catch (erro) {
      console.error("Erro ao buscar versículo:", erro);
      
      let mensagemAmigavel = 'Não foi possível encontrar o versículo. Verifique se o nome do livro, capítulo e versículo estão corretos.';
      
      // Personaliza a mensagem se o erro veio da API
      if (erro.message && erro.message.toLowerCase().includes('not found')) {
        mensagemAmigavel = `A referência "${busca.livro} ${busca.capitulo}:${busca.versiculo}" não foi encontrada. Por favor, verifique a digitação.`;
      } else if (erro.message) {
        mensagemAmigavel = `Erro: ${erro.message}`;
      }
      
      despachar({ type: 'ERRO_BUSCA', payload: mensagemAmigavel });
    }
  };

  const onSubmit = (data) => {
    buscarVersiculo({
      livro: data.livro,
      capitulo: data.capitulo,
      versiculo: data.versiculo,
    });
    reset(); // Limpa os campos do formulário após a busca
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