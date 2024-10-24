'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@components/AdminGuard';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

const Avisos = () => {
  const { data: session } = useSession();
  const [avisos, setAvisos] = useState([]);
  const [data, setData] = useState('');
  const [aviso, setAviso] = useState('');
  const [tipo, setTipo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const url = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    fetchAvisos();
  }, [url]);

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

    try {
      if (editingId) {
        await axios.put(`${url}avisos/${editingId}`, { data, aviso, tipo, Usuarios_ID: session?.user.id });
      } else {
        await axios.post(`${url}avisos/`, { data, aviso, tipo, Usuarios_ID: session?.user.id });
      }
      setAviso('');
      setTipo('');
      setData(null);
      setEditingId(null);
      setShowForm(false); // Fecha o formulário após salvar
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao salvar aviso:', error);
    }
  };

  const handleEdit = (aviso) => {
    setEditingId(aviso.id);
    setAviso(aviso.aviso);
    setTipo(aviso.tipo);
    setData(aviso.data);
    setShowForm(true);

    scrollToTop();
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
        return "bg-red-300";
      case "Urgente":
        return "bg-yellow-300";
      case "Informação":
        return "bg-blue-200";
      case "Alerta":
        return "bg-orange-300";
      case "Promoção":
        return "bg-green-200";
      default:
        return "bg-gray-200";
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // Adiciona uma animação suave ao rolar
    });
  };

  return (
    <AdminGuard>
      <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center">Avisos</h2>

        {/* Botão para abrir o formulário de criação */}
        <button
          onClick={() => {
            setShowForm(true); // Abre o formulário de criação
            setEditingId(null); // Reseta o estado de edição
            setAviso('');
            setTipo('');
            setData('');
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 flex items-center"
        >
          <FontAwesomeIcon icon={faPlus} className="mr-2" />
          Criar Aviso
        </button>

        {/* Formulário de criação/edição */}
        {showForm && (
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
              type="date"
              name="txtData"
              value={data}
              onChange={(e) => setData(e.target.value)}
              className="border border-gray-300 p-2 rounded w-full mb-2"
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
              {editingId ? 'Atualizar' : 'Criar'}
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
            >
              Cancelar
            </button>
          </form>
        )}

        {/* Lista de avisos */}
        <ul className="list-none space-y-4">
          {avisos
            .sort((a, b) => new Date(b.data) - new Date(a.data)) // Ordenação por data decrescente
            .map((aviso) => (
              <li
                key={aviso.id}
                className={`relative mb-2 p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out ${getBackgroundColor(aviso.tipo)}`}
              >
                <div className="mb-8">
                  <strong className="text-lg font-semibold text-gray-700">{aviso.tipo}</strong>
                  <p className="font-semibold text-gray-600">{aviso.aviso}</p>
                  <p className="text-gray-400 text-sm">{`Publicação em: ${new Date(aviso.data).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}`}</p>
                  {/* <p className="text-gray-400 text-sm">{`ID do Usuário: ${aviso.usuarios_id}`}</p> */}
                </div>
                <div className="absolute bottom-4 right-4 flex space-x-4">
                  <button
                    onClick={() => handleEdit(aviso)}
                    className="text-blue-500 hover:text-blue-700"
                  >
                    <FontAwesomeIcon icon={faEdit} />
                  </button>
                  <button
                    onClick={() => handleDelete(aviso.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FontAwesomeIcon icon={faTrashAlt} />
                  </button>
                </div>
              </li>
            ))}
        </ul>

        <button onClick={scrollToTop} className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
          Voltar ao Topo
        </button>
      </div>
    </AdminGuard>
  );
};

export default Avisos;
