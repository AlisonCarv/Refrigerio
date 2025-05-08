// Aluno: Álison Christian Rebouças Vidal de Carvalho - RA 2565765

import React, { useContext } from 'react';
import { EstadoBibliaContexto } from '../contexts/EstadoBibliaContexto';

function ControlesIdioma() {
  const { estado, despachar } = useContext(EstadoBibliaContexto);

  const handleChangeIdioma = (e) => {
    const novoIdioma = e.target.value;
    const novaVersao = novoIdioma === 'pt-BR' ? 'almeida' : 'web';
    const payload = { idioma: novoIdioma, versao: novaVersao };
    console.log("ControlesIdioma: Despachando DEFINIR_IDIOMA_VERSAO com payload:", payload);
    despachar({
      type: 'DEFINIR_IDIOMA_VERSAO',
      payload: payload,
    });
  };

  return (
    <div className="controles-idioma">
      <label htmlFor="idioma-select">Idioma:</label>
      <select
        id="idioma-select"
        value={estado.idioma}
        onChange={handleChangeIdioma}
      >
        <option value="pt-BR">Português (Almeida)</option>
        <option value="en">Inglês (WEB)</option>
      </select>
    </div>
  );
}

export default ControlesIdioma;