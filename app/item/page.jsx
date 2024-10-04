'use client';

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";

const Item = () => {
    const [item, setItem] = useState([]);
    const [id, setId] = useState(null); // Usado para editar um item
    const [nome, setNome] = useState("");
    const [descricao, setDescricao] = useState("");
    const [imagem_url, setImagem_url] = useState("");

    const url = "http://localhost:9081/";

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
                            className="mb-2 flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out"
                        >
                            <div>
                                <strong className="text-lg font-semibold text-gray-700">{item.id} - {item.nome}</strong>
                                <p className="text-gray-500">{item.descricao}</p>
                            </div>
                            <div className="flex space-x-2">
                                <button
                                    onClick={() => handleEdit(item)}
                                    className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-700"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(item.id)}
                                    className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700"
                                >
                                    Excluir
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
