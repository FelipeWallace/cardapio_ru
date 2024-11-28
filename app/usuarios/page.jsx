'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt, faShield } from '@fortawesome/free-solid-svg-icons';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    // const [id, setId] = useState("");
    // const [nome, setNome] = useState("");
    // const [email, setEmail] = useState("");
    // const [foto, setFoto] = useState("");
    // const [perfil, setPerfil] = useState("");
    const [filtroNome, setFiltroNome] = useState('');
    const [mediasAvaliacoes, setMediasAvaliacoes] = useState({});
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(url + "usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     const userData = { nome, email, foto, perfil };
    //     if (id) {
    //         // Atualizar usuário existente
    //         axios.put(`${url}usuarios/${id}`, userData)
    //             .then(() => {
    //                 fetch(url + "usuarios") // Recarregar a lista de usuários
    //                     .then((response) => response.json())
    //                     .then((data) => setUsuarios(data))
    //                     .catch((err) => console.log(err));
    //                 resetForm();
    //             })
    //             .catch((err) => console.log(err));
    //     } else {
    //         // Criar novo usuário
    //         axios.post(`${url}usuarios`, userData)
    //             .then(() => {
    //                 fetch(url + "usuarios") // Recarregar a lista de usuários
    //                     .then((response) => response.json())
    //                     .then((data) => setUsuarios(data))
    //                     .catch((err) => console.log(err));
    //                 resetForm();
    //             })
    //             .catch((err) => console.log(err));
    //     }
    // };

    // const handleDelete = (id) => {
    //     axios.delete(`${url}usuarios/${id}`)
    //         .then(() => {
    //             fetch(url + "usuarios") // Recarregar a lista de usuários
    //                 .then((response) => response.json())
    //                 .then((data) => setUsuarios(data))
    //                 .catch((err) => console.log(err));
    //         })
    //         .catch((err) => console.log(err));
    // };

    // const handleEdit = (usuario) => {
    //     setId(usuario.id);
    //     setNome(usuario.nome);
    //     setEmail(usuario.email);
    //     setFoto(usuario.foto);
    //     setPerfil(usuario.perfil);
    // };

    // const resetForm = () => {
    //     setId("");
    //     setNome("");
    //     setEmail("");
    //     setFoto("");
    //     setPerfil("");
    // };

    const usuariosFiltrados = usuarios.filter((usuario) => {
        return usuario.nome.toLowerCase().includes(filtroNome.toLowerCase());
    });

    useEffect(() => {
        const fetchMedias = async () => {
            const novasMedias = {};
            for (const usuario of usuariosFiltrados) {
                try {
                    const response = await axios.get(`${url}usuario/${usuario.id}/avaliacoes`);
                    console.log(`Status da requisição para usuário ${usuario.id}: ${response.status}`);

                    const avaliacoesUsuario = response.data;

                    if (avaliacoesUsuario.length > 0) {
                        const totalPontuacao = avaliacoesUsuario.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
                        novasMedias[usuario.id] = (totalPontuacao / avaliacoesUsuario.length).toFixed(2);
                    } else {
                        novasMedias[usuario.id] = "Sem avaliações";
                    }
                } catch (error) {
                    if (error.response) {
                        console.error(`Erro ao buscar avaliações do usuário ${usuario.id}: Status ${error.response.status}`);
                    } else {
                        console.error(`Erro ao buscar avaliações do usuário ${usuario.id}:`, error.message);
                    }
                    novasMedias[usuario.id] = "Sem avaliações";
                }
            }
            setMediasAvaliacoes(novasMedias);
        };

        fetchMedias();
    }, [usuariosFiltrados]);


    return (
        <AdminGuard>
            <div className="container mx-auto p-4 bg-gray-100 rounded-lg shadow-md
                sm:max-w-sm 
                md:max-w-md 
                lg:max-w-2xl 
                xl:max-w-4xl"
            >
                {/* Formulário de Usuários */}
                <h2 className="text-2xl font-bold mb-4 text-center">Usuários</h2>
                <div className="mb-4">
                    <input
                        placeholder="Buscar usuários..."
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                    />
                    {/* <input
                        type="text"
                        value={nome}
                        onChange={(e) => setNome(e.target.value)}
                        placeholder="Nome"
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                        required
                    />
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Email"
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                        required
                    />
                    <input
                        type="text"
                        value={foto}
                        onChange={(e) => setFoto(e.target.value)}
                        placeholder="Foto"
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                    />
                    <select
                        value={perfil}
                        onChange={(e) => setPerfil(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                        required
                    >
                        <option value="" disabled>Selecionar Perfil</option>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select> */}
                    {/* <button 
                        type="submit" 
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full"
                        onClick={handleSubmit}
                    >
                        {id ? "Atualizar Usuário" : "Adicionar Usuário"}
                    </button> */}
                </div>

                {/* Lista de Usuários */}
                <ul className="list-none space-y-4">
                    {usuariosFiltrados.map((usuario) => (
                        <li
                            key={usuario.id}
                            className={`mb-2 flex flex-col sm:flex-row justify-between items-center p-4 rounded-lg shadow hover:bg-gray-50 
                       ${usuario.perfil.trim() === 'admin' ? 'bg-red-200' : 'bg-gray-50'} transition duration-300 ease-in-out`}
                        >
                            <div className="flex items-center w-full sm:w-3/4 overflow-hidden mb-2 sm:mb-0">
                                <img
                                    src={usuario.foto || "https://i.ibb.co/6HJpnRs/20c00f0f135c950096a54b7b465e45cc.jpg"}
                                    alt="Foto do Usuário"
                                    className="w-10 h-10 rounded-full mr-4 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <strong className="text-lg font-semibold text-gray-700 truncate flex items-center">
                                        <span>{usuario.nome}</span>
                                        {usuario.perfil.trim() === 'admin' && (
                                            <span className="text-red-500 ml-1">
                                                <FontAwesomeIcon icon={faShield} />
                                            </span>
                                        )}
                                    </strong>
                                    <p className="text-gray-500 truncate">{usuario.email}</p>
                                </div>
                            </div>
                            <div className="flex items-center w-full sm:w-auto mb-2 sm:mb-0">
                                <span className="text-gray-600 text-sm font-medium text-center sm:text-left">
                                    {usuario.perfil.trim() === 'admin' ? (
                                        <span className="text-red-500 ml-1">
                                            {/* <FontAwesomeIcon icon={faShield} /> */}
                                            <span className="ml-1">Administrador</span>
                                        </span>
                                    ) : mediasAvaliacoes[usuario.id] === undefined
                                        ? "Carregando..."
                                        : mediasAvaliacoes[usuario.id] === "Sem avaliações"
                                            ? "Sem avaliações"
                                            : `Média de Avaliações: ${mediasAvaliacoes[usuario.id]}`}
                                </span>
                            </div>
                            {/* <div className="flex space-x-4">
                                <button
                                    onClick={() => handleEdit(usuario)}
                                    className="text-blue-500 hover:text-blue-700"
                                >
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button
                                    onClick={() => handleDelete(usuario.id)}
                                    className="text-red-500 hover:text-red-700"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} />
                                </button>
                            </div> */}
                        </li>

                    ))}
                </ul>
            </div>
        </AdminGuard>
    );
};

export default Usuarios;
