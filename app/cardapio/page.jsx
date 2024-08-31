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

    //const url = "https://restaurante-api-swart.vercel.app/";
    const url = "http://localhost:9081/";

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapio(data))
            .catch((err) => console.log(err));
    }, [url]);

    // testes requisição de itens
    //---------------------------------------------------------
    
   const [itensPorCardapio, setItensPorCardapio] = useState({});

    // useEffect(() => {
    //     fetch(url + `cardapio/${cardapioId}/itens`)
    //         .then((response) => response.json())
    //         .then((data) => setItensPorCardapio(data))
    //         .catch((err) => console.log(err));
    // }, [url]);
    
    const fetchItens = async (cardapioId) => {
        try {
            const response = await fetch(url + `cardapio/${cardapioId}/itens`);
            const data = await response.json();
            setItensPorCardapio((prev) => ({ ...prev, [cardapioId]: data }));
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    };

    useEffect(() => {
        cardapio.forEach(item => fetchItens(item.id));
    }, [cardapio]);
   //---------------------------------------------------------

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
        let obj = { id: id, data: data, refeicao: refeicao, titulo: titulo };
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

    // testes fitro de data
    //---------------------------------------------------------
    const [dataSelecionada, setDataSelecionada] = useState("");

    const handleDateChange = (e) => {
        setDataSelecionada(e.target.value);
    };

    const cardapiosFiltrados = cardapio.filter((item) => {
        if (!dataSelecionada) return true;
        return new Date(item.data).toLocaleDateString('pt-BR') === new Date(dataSelecionada).toLocaleDateString('pt-BR');
    });
    //---------------------------------------------------------
    // fim testes fitro de data


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
                - Não é possível editar
                - Como cadastrar os pratos dentro de um cardapio?
            */}

            <div className="mb-4">
                <label htmlFor="datePicker" className="block text-lg font-medium text-gray-700 mb-2">
                    Selecione uma data:
                </label>
                <input 
                    id="datePicker"
                    type="date" 
                    value={dataSelecionada} 
                    onChange={handleDateChange}
                    className="border border-gray-300 rounded px-3 py-2"
                />
            </div>

            {cardapiosFiltrados && cardapiosFiltrados.length > 0 ? (
                cardapiosFiltrados.map((item) => (
                    <div key={item.id} className="mb-6">
                        <div className="flex items-center justify-between mb-2">
                            <div>
                                {item.id} - {new Date(item.data).toLocaleDateString('pt-BR')} - {item.refeicao} - {item.titulo}
                            </div>
                            <div className="flex space-x-2">
                                <img
                                    alt="Editar"
                                    src="/assets/icons/copy.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
                                    onClick={() => editarDados(item.id)}
                                    className="cursor-pointer"
                                />
                                <img
                                    alt="Apagar"
                                    src="/assets/icons/lixeira.svg"
                                    id={item.id}
                                    height={20}
                                    width={20}
                                    onClick={() => apagarDados(item.id)}
                                    className="cursor-pointer"
                                />
                            </div>
                        </div>
                        {itensPorCardapio[item.id] && itensPorCardapio[item.id].length > 0  ? (
                            <ul className="ml-4 list-disc">
                                {itensPorCardapio[item.id].map((subItem) => (
                                    <li key={subItem.id} className="mb-2">
                                        <div className="flex items-center">
                                            {/* <img
                                                src={subItem.imagem_url}
                                                alt={subItem.nome}
                                                className="h-10 w-10 rounded-full mr-3"
                                            /> */}
                                            <div>
                                                <strong>{subItem.nome}</strong>
                                                <p className="text-gray-600">{subItem.descricao}</p>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="ml-4 text-gray-500">Nenhum item encontrado para este cardápio.</p>
                        )}
                    </div>
                ))
            ) : (
                <p>Nenhum cardápio encontrado.</p>
            )}

        </div>
    );

}

export default Cardapio
