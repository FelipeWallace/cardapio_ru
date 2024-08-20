'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [perfil, setPerfil] = useState("");
    const [tipo, setTipo] = useState("");

    const url = "https://restaurante-api-swart.vercel.app/";

    useEffect(() => {
        fetch(url + "usuarios")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    function novosDados() {
        setTipo("novo");
    }
    function limparDados() {
        setId("");
        setNome("");
        setEmail("");
        setSenha("");
        setPerfil("");
        setTipo("");
    }

    function editarDados(cod) {
        let usuario = usuarios.find((item) => item.id === cod);
        const { id, nome, email, senha, perfil } = usuario;
        setTipo("editar");
        setId(id);
        setNome(nome);
        setEmail(email);
        setSenha(senha);
        setPerfil(perfil);
    }

    function apagarDados(cod) {
        axios.delete(url + "usuarios/" + cod).then(() => {
            //atualizar a lista
            setUsuarios(usuarios.filter(item => item.id !== cod));
        });
    }

    function atualizaListaComNovoUsuario(response) {
        let { id, nome, email, senha, perfil } = response.data;
        let obj = { id: id, nome: nome, email: email, senha: senha, perfil: perfil };
        let users = usuarios;
        users.push(obj);
        setUsuarios(users);
        limparDados("");
    }

    function atualizaListaUsuarioEditado(response) {
        let { id } = response.data;
        const index = usuarios.findIndex(item => item.id == id);
        let users = usuarios;
        users[index].nome = nome;
        users[index].email = email;
        users[index].senha = senha;
        users[index].perfil = perfil;
        setUsuarios(users);
        limparDados("");
    }

    function gravaDados() {
        if (nome !== "" && email !== "" && senha !== "") {
            if (tipo === "novo") {
                axios
                    .post(url + "usuarios", {
                        nome: nome,
                        email: email,
                        senha: senha,
                        perfil: "cliente",
                    })
                    .then((response) => atualizaListaComNovoUsuario(response))
                    .catch((err) => console.log(err));
            } else if (tipo === "editar") {
                axios
                    .put(url + "usuarios/" + id, {
                        id: id,
                        nome: nome,
                        email: email,
                        senha: senha,
                        perfil: "cliente",
                    })
                    .then((response) => atualizaListaUsuarioEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    }

    return (
        <div className="p-6 font-sans">
            <button 
                type="button" 
                onClick={novosDados}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700"
            >
                Novo
            </button>
            {tipo ? (
                <>
                    <input
                        type="text"
                        name="txtNome"
                        placeholder="Nome"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                        }}
                        className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="txtEmail"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                        className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                    />
                    <input
                        type="password"
                        name="txtSenha"
                        placeholder="Senha"
                        value={senha}
                        onChange={(e) => {
                            setSenha(e.target.value);
                        }}
                        className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                    />
                    <button 
                        type="button" 
                        onClick={limparDados}
                        className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-700 mr-2"
                    >
                        Cancelar
                    </button>
                    <button 
                        type="button" 
                        onClick={gravaDados}
                        className="bg-gray-500 text-white px-4 py-2 mt-2 rounded hover:bg-gray-700"
                    >
                        Gravar
                    </button>
                </>
            ) : (
                false
            )}

            {usuarios
                ? usuarios.map((item) => {
                    return (
                        <div key={item.id} className="flex items-center justify-between p-2 mt-4 border-b">
                            <div className="flex items-center">
                                {" "}
                                {item.id} - {item.nome} - {item.email}{" "}
                                <img
                                    alt="Editar"
                                    src="/assets/icons/copy.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
                                    className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform"
                                    onClick={(e) => editarDados(item.id)}
                                />
                                <img
                                    alt="Apagar"
                                    src="/assets/icons/lixeira.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
                                    className="h-5 w-5 cursor-pointer hover:scale-110 transition-transform ml-4"
                                    onClick={(e) => apagarDados(item.id)}
                                />
                            </div>
                        </div>
                    );
                })
                : false}
        </div>
    );

}

export default Usuarios