'use client';

import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Avisos = () => {
  const [avisos, setAvisos] = useState([]);
  const [data, setData] = useState('');
  const [aviso, setAviso] = useState('');
  const [tipo, setTipo] = useState('');
  const [Usuarios_ID, setUsuariosID] = useState('');
  const [editingId, setEditingId] = useState(null);

  const url = 'http://localhost:9081/avisos';

  useEffect(() => {
    fetchAvisos();
  }, []);

  const fetchAvisos = async () => {
    try {
      const response = await axios.get(url);
      setAvisos(response.data);
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${url}/${editingId}`, { data, aviso, tipo, Usuarios_ID });
      } else {
        await axios.post(url, { data, aviso, tipo, Usuarios_ID });
      }
      setData('');
      setAviso('');
      setTipo('');
      setUsuariosID('');
      setEditingId(null);
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao salvar aviso:', error);
    }
  };

  const handleEdit = (aviso) => {
    setEditingId(aviso.id);
    setData(aviso.data);
    setAviso(aviso.aviso);
    setTipo(aviso.tipo);
    setUsuariosID(aviso.Usuarios_ID);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}/${id}`);
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
    }
  };

  return (
    <div>
      <h2>Avisos</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="date"
          placeholder="Data"
          value={data}
          onChange={(e) => setData(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Aviso"
          value={aviso}
          onChange={(e) => setAviso(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Tipo"
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
        />
        <input
          type="number"
          placeholder="Usuário ID"
          value={Usuarios_ID}
          onChange={(e) => setUsuariosID(e.target.value)}
          required
        />
        <button type="submit">{editingId ? 'Atualizar' : 'Criar'}</button>
      </form>
      <ul>
        {avisos.map((aviso) => (
          <li key={aviso.id}>
            {aviso.aviso} - {aviso.tipo}
            <button onClick={() => handleEdit(aviso)}>Editar</button>
            <button onClick={() => handleDelete(aviso.id)}>Excluir</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Avisos;
