'use client';

import { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Item = () => {
    const [item, setItem] = useState([]);
    const [id, setId] = useState(null);
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem_url, setImagem_url] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    const [errorMessage, setErrorMessage] = useState(null);
    const [successMessage, setSuccessMessage] = useState(null);

    // Fetch itens
    useEffect(() => {
        fetchItens();
    }, []);

    const fetchItens = async () => {
        try {
            const response = await axios.get(url + "itens");
            setItem(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    // Criar ou Editar Item
    const handleSubmit = async (e) => {
        e.preventDefault();

        const newItem = { nome: nome.toUpperCase(), descricao, imagem_url };

        if (id) {
            // Editar
            await axios.put(`${url}itens/${id}`, newItem);
        } else {
            // Criar
            await axios.post(url + "itens", newItem);
        }

        // Resetar o formulário
        setNome("");
        setDescricao("");
        setImagem_url("");
        setId(null);

        // Atualizar lista
        fetchItens();
    };

    // Preencher o formulário ao clicar para editar
    const handleEdit = (item) => {
        setId(item.id);
        setNome(item.nome);
        setDescricao(item.descricao);
        setImagem_url(item.imagem_url);

        scrollToTop();
    };

    const handleDelete = async (id) => {
        await axios.delete(`${url}itens/${id}`);
        fetchItens();
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
                <h2 className="text-2xl font-bold mb-4">Gerenciar Itens</h2>

                {/* Formulário para criar ou editar itens */}
                <form onSubmit={handleSubmit} className="mb-6">
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
                </form>

                {/* Lista de Itens */}
                <ul className="list-none space-y-4">
                    {item.map((item) => (
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
                                <strong className="text-lg font-semibold text-gray-700">{item.id} - {item.nome}</strong>
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
