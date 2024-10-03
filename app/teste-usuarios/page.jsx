'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import AdminGuard from "@components/AdminGuard";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [foto, setFoto] = useState("");
    const [perfil, setPerfil] = useState("");

    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const userData = { nome, email, foto, perfil};
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

    const handleDelete = (id) => {
        axios.delete(`${url}usuarios/${id}`)
            .then(() => {
                fetch(url + "usuarios") // Recarregar a lista de usuários
                    .then((response) => response.json())
                    .then((data) => setUsuarios(data))
                    .catch((err) => console.log(err));
            })
            .catch((err) => console.log(err));
    };

    const handleEdit = (usuario) => {
        setId(usuario.id);
        setNome(usuario.nome);
        setEmail(usuario.email);
        setFoto(usuario.foto);
        setPerfil(usuario.perfil);
    };

    const resetForm = () => {
        setId("");
        setNome("");
        setEmail("");
        setFoto("");
        setPerfil("");
    };

    return (
        <AdminGuard>
            <div className="p-4 max-w-lg mx-auto bg-gray-100 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold mb-4 text-center">Usuários</h2>
            <form onSubmit={handleSubmit} className="mb-4">
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
                    required 
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
                <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700">
                    {id ? "Atualizar Usuário" : "Adicionar Usuário"}
                </button>
            </form>
            <ul className="list-none space-y-4">
                {usuarios.map((usuario) => (
                    <li key={usuario.id} className="mb-2 flex justify-between items-center bg-white p-4 rounded-lg shadow hover:bg-gray-50 transition duration-300 ease-in-out">
                        <div>
                            <strong className="text-lg font-semibold text-gray-700">{usuario.nome}</strong>
                            <p className="text-gray-500">{usuario.id}-{usuario.email}</p>
                        </div>
                        <div className="flex space-x-4">
                            <button onClick={() => handleEdit(usuario)} className="text-blue-500 hover:text-blue-700">
                                Editar
                            </button>
                            <button onClick={() => handleDelete(usuario.id)} className="text-red-500 hover:text-red-700">
                                Excluir
                            </button>
                        </div>
                    </li>
                ))}
            </ul>
        </div>
        </AdminGuard>
    );
};

export default Usuarios;
