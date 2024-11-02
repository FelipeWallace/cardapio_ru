'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [perfil, setPerfil] = useState("");
    const [filtroNome, setFiltroNome] = useState('');
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(url + "usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { nome, email, foto, perfil };
        if (id) {
            // Atualizar usuário existente
            axios.put(`${url}usuarios/${id}`, userData)
                .then(() => {
                    fetch(url + "usuarios") // Recarregar a lista de usuários
                        .then((response) => response.json())
                        .then((data) => setUsuarios(data))
                        .catch((err) => console.log(err));
                    resetForm();
                })
                .catch((err) => console.log(err));
        } else {
            // Criar novo usuário
            axios.post(`${url}usuarios`, userData)
                .then(() => {
                    fetch(url + "usuarios") // Recarregar a lista de usuários
                        .then((response) => response.json())
                        .then((data) => setUsuarios(data))
                        .catch((err) => console.log(err));
                    resetForm();
                })
                .catch((err) => console.log(err));
        }
    };

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

    const resetForm = () => {
        setId("");
        setNome("");
        setEmail("");
        setFoto("");
        setPerfil("");
    };

    const usuariosFiltrados = usuarios.filter((usuario) => {
        return usuario.nome.toLowerCase().includes(filtroNome.toLowerCase());
    });

    return (
        <AdminGuard>
            <div className="p-4 max-w-4xl mx-auto bg-gray-100 rounded-lg shadow-md">
                {/* Formulário de Usuários */}
                <h2 className="text-2xl font-bold mb-4 text-center">Usuários</h2>
                <form onSubmit={handleSubmit} className="mb-4 bg-gray-100 p-4 rounded-lg shadow-md">
                    <input
                        placeholder="Buscar usuários..."
                        type="text"
                        value={filtroNome}
                        onChange={(e) => setFiltroNome(e.target.value)}
                        className="border border-gray-300 p-2 rounded w-full mb-2"
                    />
                    <input
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
                    </select>
                    <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 w-full">
                        {id ? "Atualizar Usuário" : "Adicionar Usuário"}
                    </button>
                </form>

                {/* Lista de Usuários */}
                <ul className="list-none space-y-4">
                    {usuariosFiltrados.map((usuario) => (
                        <li
                            key={usuario.id}
                            className={`mb-2 flex justify-between items-center p-4 rounded-lg shadow hover:bg-gray-50 
                            ${usuario.perfil.trim() === 'admin' ? 'bg-red-200' : 'bg-gray-50'} transition duration-300 ease-in-out`}
                        >
                            <div className="flex items-center w-3/4 overflow-hidden">
                                <img
                                    src={usuario.foto || "https://i.ibb.co/6HJpnRs/20c00f0f135c950096a54b7b465e45cc.jpg"}
                                    alt="Foto do Usuário"
                                    className="w-10 h-10 rounded-full mr-4 flex-shrink-0"
                                />
                                <div className="flex-1 min-w-0">
                                    <strong className="text-lg font-semibold text-gray-700 truncate flex items-center">
                                        <span>{usuario.nome}</span>
                                        {usuario.perfil.trim() === 'admin' && (
                                            <span className="text-red-500 ml-1">- Administrador</span>
                                        )}
                                    </strong>
                                    <p className="text-gray-500 truncate">{usuario.id} - {usuario.email}</p>
                                </div>
                            </div>
                            <div className="flex space-x-4">
                                {/* <button
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
                                </button> */}
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </AdminGuard>
    );
};

export default Usuarios;
