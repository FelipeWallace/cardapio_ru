'use client';

import { useEffect, useState } from 'react';
import { useSession, signIn } from 'next-auth/react';
import axios from 'axios';
import '@styles/globals.css';

const Avisos = () => {
  const { data: session, status } = useSession();
  const [avisos, setAvisos] = useState([]);
  const [data, setData] = useState('');
  const [aviso, setAviso] = useState('');
  const [tipo, setTipo] = useState('');
  const [Usuarios_ID, setUsuariosID] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [isUserAdmin, setIsUserAdmin] = useState(false); // Para armazenar se o usuário é admin
  const url = 'http://localhost:9081/';

  useEffect(() => {
    const checkIfUserIsAdmin = async () => {
      if (session && session.user) {
        try {
          const response = await fetch(`${url}usuarios/${session.user.id}`);
          const data = await response.json();

          const perfil = data.perfil.trim();

          setIsUserAdmin(perfil === "admin"); // Define como true se o perfil for admin
        } catch (err) {
          console.log("Erro ao buscar usuário:", err);
        }
      }
    };

    checkIfUserIsAdmin();
  }, [session]);

  useEffect(() => {
    if (isUserAdmin) {
      fetchAvisos(); // Somente busca avisos se o usuário for admin
    }
  }, [isUserAdmin]);

  const fetchAvisos = async () => {
    try {
      const response = await axios.get(url + 'avisos');
      setAvisos(response.data);
    } catch (error) {
      console.error('Erro ao buscar avisos:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const dataAtual = new Date();

    try {
      if (editingId) {
        await axios.put(`${url}avisos/${editingId}`, { data: dataAtual, aviso, tipo, Usuarios_ID });
      } else {
        await axios.post(`${url}avisos/`, { data: dataAtual, aviso, tipo, Usuarios_ID });
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
    setUsuariosID(aviso.usuarios_id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}avisos/${id}`);
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
    }
  };

  const getBackgroundColor = (tipo) => {
    const tipoAviso = tipo.trim();
    switch (tipoAviso) {
      case "Importante":
        return "bg-red-200";
      case "Urgente":
        return "bg-yellow-200";
      case "Informação":
        return "bg-blue-200";
      case "Alerta":
        return "bg-orange-200";
      case "Promoção":
        return "bg-green-200";
      default:
        return "bg-gray-100"; // Cor padrão
    }
  };

  // Verifica o status da sessão
  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (status === 'unauthenticated' || !session) {
    return (
      <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
        <p className="text-red-500">Você precisa estar logado para acessar esta página.</p>
        <button onClick={() => signIn()} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Fazer login
        </button>
      </div>
    );
  }

  // Verifica se o usuário é admin
  if (!isUserAdmin) {
    return (
      <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
        <p className="text-red-500">Você não tem permissão para acessar esta página.</p>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-center">Avisos</h2>
      <form onSubmit={handleSubmit} className="mb-4">
        <textarea
          type="text"
          placeholder="Aviso"
          value={aviso}
          onChange={(e) => setAviso(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded w-full mb-2"
        />
        <select
          value={tipo}
          onChange={(e) => setTipo(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded w-full mb-2"
        >
          <option value="" disabled>Selecione o tipo de aviso</option>
          <option value="Importante">Importante</option>
          <option value="Urgente">Urgente</option>
          <option value="Informação">Informação</option>
          <option value="Alerta">Alerta</option>
          <option value="Promoção">Promoção</option>
        </select>
        <input
          type="number"
          placeholder="Usuário ID"
          value={Usuarios_ID}
          onChange={(e) => setUsuariosID(e.target.value)}
          required
          className="border border-gray-300 p-2 rounded w-full mb-2"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          {editingId ? 'Atualizar' : 'Criar'}
        </button>
      </form>
      <ul className="list-none space-y-4">
        {avisos
          .sort((a, b) => new Date(b.data) - new Date(a.data)) // Ordenação por data decrescente
          .map((aviso) => (
          <li
            key={aviso.id}
            className={`mb-2 flex justify-between items-center p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out ${getBackgroundColor(aviso.tipo)}`}
          >
            <div>
              <strong className="text-lg font-semibold text-gray-700">{aviso.aviso}</strong>
              <p className="text-gray-500">{`Tipo: ${aviso.tipo}`}</p>
              <p className="text-gray-500">{`Data: ${aviso.data}`}</p>
              <p className="text-gray-400 text-sm">{`ID do Usuário: ${aviso.usuarios_id}`}</p>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={() => handleEdit(aviso)}
                className="text-blue-500 hover:text-blue-700"
              >
                Editar
              </button>
              <button
                onClick={() => handleDelete(aviso.id)}
                className="text-red-500 hover:text-red-700"
              >
                Excluir
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Avisos;
