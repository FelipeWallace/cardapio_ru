'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Avaliacoes = () => {
  const [avaliacoes, setAvaliacoes] = useState([]);
  const [pontuacao, setPontuacao] = useState('');
  const [comentario, setComentario] = useState('');
  const [data, setData] = useState('');
  const [Usuarios_ID, setUsuariosID] = useState('');
  const [Cardapio_ID, setCardapioID] = useState('');
  const [editingId, setEditingId] = useState(null);

  const url = 'http://localhost:9081/avaliacoes';

  useEffect(() => {
    fetchAvaliacoes();
  }, []);

  const fetchAvaliacoes = async () => {
    try {
      const response = await axios.get(url);
      setAvaliacoes(response.data);
    } catch (error) {
      console.error('Erro ao buscar avaliações:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${url}/${editingId}`, { pontuacao, comentario, data, Usuarios_ID, Cardapio_ID });
      } else {
        await axios.post(url, { pontuacao, comentario, data, Usuarios_ID, Cardapio_ID });
      }
      setPontuacao('');
      setComentario('');
      setData('');
      setUsuariosID('');
      setCardapioID('');
      setEditingId(null);
      fetchAvaliacoes();
    } catch (error) {
      console.error('Erro ao salvar avaliação:', error);
    }
  };

  const handleEdit = (avaliacao) => {
    setEditingId(avaliacao.id);
    setPontuacao(avaliacao.pontuacao);
    setComentario(avaliacao.comentario);
    setData(avaliacao.data);
    setUsuariosID(avaliacao.Usuarios_ID);
    setCardapioID(avaliacao.Cardapio_ID);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      fetchAvaliacoes();
    } catch (error) {
      console.error('Erro ao deletar avaliação:', error);
    }
  };

  return (
    <div>
      <h2>Avaliações</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="number"
          placeholder="Pontuação"
          value={pontuacao}
          onChange={(e) => setPontuacao(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Comentário"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
        />
        <input
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Usuário ID"
          value={Usuarios_ID}
          onChange={(e) => setUsuariosID(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Cardápio ID"
          value={Cardapio_ID}
          onChange={(e) => setCardapioID(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
      </form>
      <ul>
        {avaliacoes.map((avaliacao) => (
          <li key={avaliacao.id}>
            {avaliacao.pontuacao} - {avaliacao.comentario}
            <button onClick={() => handleEdit(avaliacao)}>Editar</button>
            <button onClick={() => handleDelete(avaliacao.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Avaliacoes;
