'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faPlus } from '@fortawesome/free-solid-svg-icons';

const Item = () => {
    const [item, setItem] = useState([]);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem_url, setImagem_url] = useState("");
    const [showForm, setShowForm] = useState(false);
    const [filtroNome, setFiltroNome] = useState('');
    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetchItens();
    }, [url]);

    const fetchItens = async () => {
        try {
            const response = await axios.get(url + "itens");
            setItem(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setErrorMessage('');
        setSuccessMessage('');

        const newItem = { nome: nome.toUpperCase(), descricao, imagem_url };

        if (id) {
            await axios.put(`${url}itens/${id}`, newItem);
            setSuccessMessage("Item atualizado com sucesso!");
        } else {
            await axios.post(url + "itens", newItem);
            setSuccessMessage("Item criado com sucesso!");
        }

        // Resetar o formulário
        setNome("");
        setDescricao("");
        setImagem_url("");
        setId(null);
        setShowForm(false);
        fetchItens();
    };

    // Preencher o formulário ao clicar para editar
    const handleEdit = (item) => {
        setId(item.id);
        setNome(item.nome);
        setDescricao(item.descricao);
        setImagem_url(item.imagem_url);
        setShowForm(true);
        scrollToTop();
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`${url}itens/${id}`);
            setSuccessMessage('Item excluído com sucesso!');
            fetchItens();
        } catch (error) {
            console.error('Erro ao deletar item', error);
            setErrorMessage('Erro ao deletar item', error);
        }

    };

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    const itensFiltrados = item.filter((item) => {
        return item.nome.toLowerCase().includes(filtroNome.toLowerCase());
    });

    return (
        <AdminGuard>
            <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md 
                sm:max-w-sm 
                md:max-w-md 
                lg:max-w-2xl 
                xl:max-w-4xl"
            >
                <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage('')} />
                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage('')} />

                <h2 className="text-2xl font-bold mb-4 text-center">Gerenciar Itens</h2>

                {/* Filtro de itens */}
                <div className="mb-4">
                    <input
                        placeholder="Filtrar por nome do item"
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="mt-1 p-2 border border-gray-300 rounded w-full"
                    />
                </div>
                <button
                    onClick={() => {
                        setShowForm(true);
                        setNome("");
                        setDescricao("");
                        setImagem_url("");
                        setId(null);
                    }}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 mb-4 flex items-center"
                >
                    <FontAwesomeIcon icon={faPlus} className="mr-2" />
                    Criar Item
                </button>

                {/* Formulário para criar ou editar itens */}
                {showForm && (
                    <form onSubmit={handleSubmit} className="mb-4">
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Nome do Item</label>
                            <input
                                type="text"
                                value={nome}
                                onChange={(e) => setNome(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Descrição</label>
                            <input
                                type="text"
                                value={descricao}
                                onChange={(e) => setDescricao(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                                required
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Imagem URL</label>
                            <input
                                type="text"
                                value={imagem_url}
                                onChange={(e) => setImagem_url(e.target.value)}
                                className="mt-1 p-2 border border-gray-300 rounded w-full"
                            />
                        </div>
                        <button
                            type="submit"
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                        >
                            {id ? "Editar Item" : "Criar Item"}
                        </button>
                        <button
                            onClick={() => setShowForm(false)}
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 ml-2"
                        >
                            Cancelar
                        </button>
                    </form>
                )}
                {/* Lista de Itens */}
                <ul className="list-none space-y-4">
                    {itensFiltrados.map((item) => (
                        <li
                            key={item.id}
                            className="flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                            <img
                                src={item.imagem_url ? item.imagem_url : "https://i.ibb.co/pbcBmrY/ae65dba955ffbad623f51d2fae50d7e4.jpg"}
                                alt={item.nome}
                                className="object-cover rounded w-20 h-20 transition duration-300 ease-in-out transform hover:scale-110"
                            />
                            <div className="flex-1 mx-4">
                                <strong className="text-lg font-semibold text-gray-700">{item.nome}</strong>
                                <p className="text-gray-500">{item.descricao}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
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

export default Item;
