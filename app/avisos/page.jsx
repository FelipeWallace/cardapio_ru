'use client';

import { useEffect, useState } from 'react';
import AdminGuard from '@components/AdminGuard';
import Notification from '@components/Notification';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus, faFilter, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';
import { useSession } from 'next-auth/react';

const Avisos = () => {
  const { data: session } = useSession();
  const [avisos, setAvisos] = useState([]);
  const [data, setData] = useState('');
  const [aviso, setAviso] = useState('');
  const [tipo, setTipo] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroDataInicio, setFiltroDataInicio] = useState('');
  const [filtroDataFim, setFiltroDataFim] = useState('');
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

    setErrorMessage('');
    setSuccessMessage('');

    try {
      if (editingId) {
        await axios.put(`${url}avisos/${editingId}`, { data, aviso, tipo, Usuarios_ID: session?.user.id });
        setSuccessMessage('Aviso atualizado com sucesso!');
      } else {
        await axios.post(`${url}avisos/`, { data, aviso, tipo, Usuarios_ID: session?.user.id });
        setSuccessMessage('Aviso criado com sucesso!');
      }
      setAviso('');
      setTipo('');
      setData(null);
      setEditingId(null);
      setShowForm(false);
      fetchAvisos();
    } catch (error) {
      setErrorMessage('Erro ao salvar aviso:', error);
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
      setSuccessMessage('Aviso excluído com sucesso!');
      fetchAvisos();
    } catch (error) {
      console.error('Erro ao deletar aviso:', error);
      setErrorMessage('Erro ao deletar aviso:', error);
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
      behavior: 'smooth'
    });
  };

  // Filtrar avisos por tipo e data
  const avisosFiltrados = avisos
    .filter((aviso) => {
      return (
        (!filtroTipo || aviso.tipo.trim() === filtroTipo) &&
        (!filtroDataInicio || new Date(aviso.data) >= new Date(filtroDataInicio)) &&
        (!filtroDataFim || new Date(aviso.data) <= new Date(filtroDataFim))
      );
    })
    .sort((a, b) => new Date(b.data) - new Date(a.data));

  // Teste para formatar a data
  const formatarData = (data) => {
    data = data.split('T')[0];
    const [ano, mes, dia] = data.split('-');
    return `${dia}/${mes}/${ano}`;
  };

  return (
    <AdminGuard>
      <div className="p-4 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
        <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
        <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />

        <h2 className="text-2xl font-bold mb-4 text-center">Avisos</h2>

        {/* Filtros de Avisos */}
        <div className="mb-4 flex space-x-4 items-center">
          {/* Dropdown de Tipo com ícone de filtro */}
          <div className="relative">
            <FontAwesomeIcon icon={faFilter} className="absolute left-3 top-3 text-gray-400" />
            <select
              value={filtroTipo}
              onChange={(e) => setFiltroTipo(e.target.value)}
              className="border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
            >
              <option value="">Filtrar por tipo</option>
              <option value="Importante">Importante</option>
              <option value="Urgente">Urgente</option>
              <option value="Informação">Informação</option>
              <option value="Alerta">Alerta</option>
              <option value="Promoção">Promoção</option>
            </select>
          </div>

          {/* Campo de Data Início com ícone de calendário */}
          <div className="relative">
            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={filtroDataInicio}
              onChange={(e) => setFiltroDataInicio(e.target.value)}
              className="border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Data Início"
            />
          </div>

          {/* Campo de Data Fim com ícone de calendário */}
          <div className="relative">
            <FontAwesomeIcon icon={faCalendarAlt} className="absolute left-3 top-3 text-gray-400" />
            <input
              type="date"
              value={filtroDataFim}
              onChange={(e) => setFiltroDataFim(e.target.value)}
              className="border border-gray-300 pl-10 pr-4 py-2 rounded focus:outline-none focus:border-blue-500"
              placeholder="Data Fim"
            />
          </div>
        </div>

        {/* Botão para abrir o formulário de criação */}
        <button
          onClick={() => {
            setShowForm(true);
            setEditingId(null);
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

        {/* Lista de avisos filtrada */}
        <ul className="list-none space-y-4">
          {avisosFiltrados.map((aviso) => (
            <li
              key={aviso.id}
              className={`relative mb-2 p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out ${getBackgroundColor(aviso.tipo)}`}
            >
              <div className="mb-8">
                <strong className="text-lg font-semibold text-gray-700">{aviso.tipo}</strong>
                <p className="font-semibold text-gray-600">{aviso.aviso}</p>
                <p className="text-gray-400 text-sm">{`Publicação em: ${formatarData(aviso.data)}`}</p>
                {/* <p className="text-gray-400 text-sm">{`Publicação em: ${new Date(aviso.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })}`}</p> */}
              </div>
              <div className="absolute bottom-4 right-4 flex space-x-4">
                <button onClick={() => handleEdit(aviso)} className="text-blue-500 hover:text-blue-700">
                  <FontAwesomeIcon icon={faEdit} />
                </button>
                <button onClick={() => handleDelete(aviso.id)} className="text-red-500 hover:text-red-700">
                  <FontAwesomeIcon icon={faTrashAlt} />
                </button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </AdminGuard>
  );
};

export default Avisos;
