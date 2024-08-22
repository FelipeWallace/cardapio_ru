'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";

const Cardapio = () => {
    const [cardapio, setCardapio] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState(null);
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
        setData(null);
        setRefeicao("");
        setTitulo("");
    }

    function editarDados(cod) {
        let cardapio = cardapio.find((item) => item.id === cod);
        const { id, data, refeicao, titulo } = cardapio;
        setTipo("editar");
        setId(id);
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
        let { id, data, refeicao, titulo } = response.data;
        let obj = { ii: id, data: data, refeicao: refeicao, titulo: titulo };
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
        if (data !== null && refeicao !== "" && titulo !== "") {
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
                        type="date"
                        name="txtData"
                        value={data}
                        onChange={(e) => {
                            setData(e.target.value);
                        }}
                        className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="txtRefeicao"
                        placeholder="Refeição"
                        value={refeicao}
                        onChange={(e) => {
                            setRefeicao(e.target.value);
                        }}
                        className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
                    />
                    <input
                        type="text"
                        name="txtTitulo"
                        placeholder="Título"
                        value={titulo}
                        onChange={(e) => {
                            setTitulo(e.target.value);
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
            {/* 
                - Não está indexando mas é possível criar um novo
                - Esta salvando a data do dia anterior
                - Como cadastrar os pratos dentro de um cardapio?
            */}
            {cardapio
                ? cardapio.map((item) => {
                    return (
                        <div key={item.id}>
                            <div>
                                {" "}
                                {item.id} - {new Date(item.data).toLocaleDateString("pt-BR")} - {item.refeicao} - {item.titulo}{" "}
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
