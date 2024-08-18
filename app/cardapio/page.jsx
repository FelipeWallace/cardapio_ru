'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

const Cardapio = () => {
    const [cardapio, setCardapio] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState("");
    const [refeicao, setRefeicao] = useState("");
    const [titulo, setTitulo] = useState("");
    const [tipo, setTipo] = useState("");

    const url = "https://restaurante-api-swart.vercel.app/";

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setUsuarios(data))
            .catch((err) => console.log(err));
    }, [url]);

    function novosDados() {
        setTipo("novo");
    }
    function limparDados() {
        setId("");
        setData("");
        setRefeicao("");
        setTitulo("");
    }

    function editarDados(cod) {
        let cardapio = cardapio.find((item) => item.id === cod);
        const { data, refeicao, titulo } = cardapio;
        setTipo("editar");
        setData(data);
        setRefeicao(refeicao);
        setTitulo(titulo);
    }

    function apagarDados(cod) {
        axios.delete(url + "cardapio/" + cod).then(() => {
            //atualizar a lista
            setCardapio(cardapio.filter(item => item.id !== cod));
        });
    }

    function atualizaListaComNovoCardapio(response) {
        let { data, refeicao, titulo } = response.data;
        let obj = { data: data, refeicao: refeicao, titulo: titulo };
        let card = cardapio;
        card.push(obj);
        setCardapio(card);
        limparDados("");
    }

    function atualizaListaCardapioEditado(response) {
        let { id } = response.data;
        const index = cardapio.findIndex(item => item.id == id);
        let card = cardapio;
        card[index].data = data;
        card[index].refeicao = refeicao;
        card[index].titulo = titulo;
        setCardapio(card);
        limparDados("");
    }

    function gravaDados() {
        if (data !== "" && refeicao !== "" && titulo !== "") {
            if (tipo === "novo") {
                axios
                    .post(url + "cardapio", {
                        data: data,
                        refeicao: refeicao,
                        titulo: titulo,
                    })
                    .then((response) => atualizaListaComNovoCardapio(response))
                    .catch((err) => console.log(err));
            } else if (tipo === "editar") {
                axios
                    .put(url + "cardapio/" + id, {
                        id: id,
                        data: data,
                        refeicao: refeicao,
                        titulo: titulo,
                    })
                    .then((response) => atualizaListaCardapioEditado(response))
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
                        type="date"
                        name="txtData"
                        value={data}
                        onChange={(e) => {
                            setNome(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        name="txtRefeicao"
                        value={refeicao}
                        onChange={(e) => {
                            setRefeicao(e.target.value);
                        }}
                    />
                    <input
                        type="text"
                        name="txtTitulo"
                        value={titulo}
                        onChange={(e) => {
                            setTitulo(e.target.value);
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

            {cardapio
                ? cardapio.map((item) => {
                    return (
                        <div key={item.id}>
                            <div>
                                {" "}
                                {item.id} - {item.data} - {item.refeicao} - {item.titulo}{" "}
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

export default Cardapio
