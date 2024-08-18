'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

const Usuarios = () => {
    const [usuarios, setUsuarios] = useState([]);
    const [id, setId] = useState("");
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
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
        setTipo("");
    }

    function editarDados(cod) {
        let usuario = usuarios.find((item) => item.id === cod);
        const { id, nome, email } = usuario;
        setTipo("editar");
        setId(id);
        setNome(nome);
        setEmail(email);
    }

    function apagarDados(cod) {
        axios.delete(url + "usuarios/" + cod).then(() => {
            //atualizar a lista
            setUsuarios(usuarios.filter(item => item.id !== cod));
        });
    }

    function atualizaListaComNovoUsuario(response) {
        let { id, nome, email } = response.data;
        let obj = { id: id, nome: nome, email: email };
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
        setUsuarios(users);
        limparDados("");
    }

    function gravaDados() {
        if (nome !== "" && email !== "") {
            if (tipo === "novo") {
                axios
                    .post(url + "usuarios", {
                        nome: nome,
                        email: email,
                    })
                    .then((response) => atualizaListaComNovoUsuario(response))
                    .catch((err) => console.log(err));
            } else if (tipo === "editar") {
                axios
                    .put(url + "usuarios/" + id, {
                        id: id,
                        nome: nome,
                        email: email,
                    })
                    .then((response) => atualizaListaUsuarioEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    }

    return (
        <div>
            <button type="button" onClick={novosDados}>
                Novo
            </button>
            {tipo ? (
                <>
                    <input
                        type="text"
                        name="txtNome"
                        value={nome}
                        onChange={(e) => {
                            setNome(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        name="txtEmail"
                        value={email}
                        onChange={(e) => {
                            setEmail(e.target.value);
                        }}
                    />
                    <button type="button" onClick={limparDados}>
                        Cancelar
                    </button>
                    <button type="button" onClick={gravaDados}>
                        Gravar
                    </button>
                </>
            ) : (
                false
            )}

            {usuarios
                ? usuarios.map((item) => {
                    return (
                        <div key={item.id}>
                            <div>
                                {" "}
                                {item.id} - {item.nome} - {item.email}{" "}
                                <img
                                    alt="Editar"
                                    src="/assets/icons/copy.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
                                    onClick={(e) => editarDados(item.id)}
                                />
                                <img
                                    alt="Apagar"
                                    src="/assets/icons/lixeira.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
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