'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import AvaliacoesModal from "@components/AvaliacoesModal";
import { useSession } from "next-auth/react";

// Componente de Formulário para criar/editar cardápios
const CardapioForm = ({ tipo, data, refeicao, titulo, setData, setRefeicao, setTitulo, limparDados, gravaDados }) => (
    <>
        <input
            type="date"
            name="txtData"
            value={data}
            onChange={(e) => setData(e.target.value)}
            className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
        />
        <input
            type="text"
            name="txtRefeicao"
            placeholder="Refeição"
            value={refeicao}
            onChange={(e) => setRefeicao(e.target.value)}
            className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
        />
        <input
            type="text"
            name="txtTitulo"
            placeholder="Título"
            value={titulo}
            onChange={(e) => setTitulo(e.target.value)}
            className="block w-full max-w-xs p-2 mt-2 border border-gray-300 rounded"
        />
        <div className="mt-4">
            <button
                type="button"
                onClick={limparDados}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mr-2"
            >
                Cancelar
            </button>
            <button
                type="button"
                onClick={gravaDados}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
            >
                {tipo === "novo" ? "Criar" : "Atualizar"}
            </button>
        </div>
    </>
);

// Componente de Item de Cardápio com exibição dos itens do cardápio
const CardapioItem = ({ item, editarDados, apagarDados, itens, handleAvaliarClick, mediaAvaliacoes }) => (
    <div key={item.id} className="mb-6 p-4 bg-white rounded shadow-md">
        <div className="flex items-center justify-between mb-2">
            <div>
                {item.id} - <strong>{new Date(item.data).toLocaleDateString('pt-BR')}</strong> - {item.refeicao} - {item.titulo}
                <p>{`Média de Avaliações: ${mediaAvaliacoes(item.id)}`}</p> {/* Exibe a média */}
            </div>
            <div className="flex space-x-2">
                <button 
                    // ainda falta passar o userId
                    onClick={() => handleAvaliarClick(item.id)} 
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700">
                    Avaliar
                </button>
                <button
                    onClick={() => editarDados(item.id)}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300 flex items-center space-x-2"
                >
                    Editar
                </button>

                <button
                    onClick={() => apagarDados(item.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition duration-300 flex items-center space-x-2"
                >
                    Apagar
                </button>

            </div>
        </div>
        {itens && itens.length > 0 ? (
            <ul className="ml-4 list-disc">
                {itens.map(subItem => (
                    <li key={subItem.id} className="mb-2">
                        <strong>{subItem.nome}</strong>
                        <p className="text-gray-600">{subItem.descricao}</p>
                    </li>
                ))}
            </ul>
        ) : (
            <p className="ml-4 text-gray-500">Nenhum item encontrado para este cardápio.</p>
        )}
    </div>
);

const Cardapio = () => {
    const { data: session } = useSession();

    const [cardapio, setCardapio] = useState([]);
    const [id, setId] = useState("");
    const [data, setData] = useState(null);
    const [refeicao, setRefeicao] = useState("");
    const [titulo, setTitulo] = useState("");
    const [itensPorCardapio, setItensPorCardapio] = useState({});
    const [dataSelecionada, setDataSelecionada] = useState("");
    const [tipo, setTipo] = useState("");
    const [loading, setLoading] = useState(false);

    const [selectedCardapioId, setSelectedCardapioId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState("");

    const [avaliacoes, setAvaliacoes] = useState([]);

    

    const url = "http://localhost:9081/";

    useEffect(() => {
        setLoading(true);
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapio(data))
            .catch((err) => console.log(err))
            .finally(() => setLoading(false));
    }, [url]);

    useEffect(() => {
        cardapio.forEach(item => fetchItens(item.id));
    }, [cardapio]);

    useEffect(() => {
        axios.get(url + "avaliacoes")
            .then(response => setAvaliacoes(response.data))
            .catch(err => console.log(err));
    }, []);

    const fetchItens = async (cardapioId) => {
        try {
            const response = await fetch(url + `cardapio/${cardapioId}/itens`);
            const data = await response.json();
            setItensPorCardapio((prev) => ({ ...prev, [cardapioId]: data }));
        } catch (error) {
            console.error("Erro ao buscar itens:", error);
        }
    };

    // Função para normalizar a data e garantir o formato YYYY-MM-DD
    const normalizarData = (data) => {
        return new Date(data).toISOString().split('T')[0];
    };

    // Filtrar os cardápios com base na data selecionada
    const cardapiosFiltrados = cardapio.filter((item) => {
        if (!dataSelecionada) return true;

        // Normaliza a data vinda do backend e a data selecionada
        const dataItemNormalizada = normalizarData(item.data);
        const dataSelecionadaNormalizada = normalizarData(dataSelecionada);

        return dataItemNormalizada === dataSelecionadaNormalizada;
    });

    const novosDados = () => setTipo("novo");

    const limparDados = () => {
        setId("");
        setData(null);
        setRefeicao("");
        setTitulo("");
        setTipo("");
    };

    const editarDados = (cod) => {
        const cardapioSelecionado = cardapio.find((item) => item.id === cod);
        const { id, data, refeicao, titulo } = cardapioSelecionado;
        setTipo("editar");
        setId(id);
        setData(data);
        setRefeicao(refeicao);
        setTitulo(titulo);
    };

    // Função para excluir o cardápio e remover os itens relacionados
    const apagarDados = (cardapioId) => {
        try {
            // Primeiro, excluir todos os itens relacionados ao cardápio
            const urlItens = `${url}cardapio/${cardapioId}/itens`;
            axios.delete(urlItens); // Requisição DELETE para remover itens
    
            // Depois de excluir os itens, excluir o cardápio
            const urlCardapio = `${url}cardapio/${cardapioId}`;
            axios.delete(urlCardapio); // Requisição DELETE para remover cardápio
    
            // Atualizar a lista de cardápios no frontend após a exclusão
            setCardapio(cardapio.filter(item => item.id !== cardapioId));
    
            console.log("Cardápio e seus itens foram removidos com sucesso!");
        } catch (error) {
            console.error("Erro ao remover o cardápio e seus itens:", error);
        }
    };
    
    const gravaDados = () => {
        if (data && refeicao && titulo) {
            if (tipo === "novo") {
                axios.post(url + "cardapio", { data, refeicao, titulo })
                    .then((response) => atualizaListaComNovoCardapio(response))
                    .catch((err) => console.log(err));
            } else if (tipo === "editar") {
                axios.put(url + "cardapio/" + id, { id, data, refeicao, titulo })
                    .then((response) => atualizaListaCardapioEditado(response))
                    .catch((err) => console.log(err));
            }
        } else {
            console.log("Preencha os campos");
        }
    };

    const atualizaListaComNovoCardapio = (response) => {
        const novoCardapio = response.data;
        setCardapio([...cardapio, novoCardapio]);
        limparDados();
    };

    const atualizaListaCardapioEditado = (response) => {
        const cardapioEditado = response.data;
        const cardapiosAtualizados = cardapio.map(item => item.id === cardapioEditado.id ? cardapioEditado : item);
        setCardapio(cardapiosAtualizados);
        limparDados();
    };

    const handleAvaliarClick = (id) => {
        setSelectedCardapioId(id);
        setUserId(session?.user.id);
        setIsModalOpen(true); // Abre o modal
    };

    const closeModal = () => {
        setIsModalOpen(false); // Fecha o modal
    };

    const calcularMediaAvaliacoes = (cardapioId) => {
        const avaliacoesDoCardapio = avaliacoes.filter(avaliacao => avaliacao.cardapio_id === cardapioId);
        if (avaliacoesDoCardapio.length === 0) return "Sem avaliações"; // Caso não tenha avaliações
        const totalPontuacao = avaliacoesDoCardapio.reduce((acc, avaliacao) => acc + avaliacao.pontuacao, 0);
        return (totalPontuacao / avaliacoesDoCardapio.length).toFixed(2); // Média com duas casas decimais
    };

    return (
        <div className="container mx-auto p-4">
            <button
                type="button"
                onClick={novosDados}
                className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-700 mb-4"
            >
                Novo Cardápio
            </button>
            {tipo && (
                <CardapioForm
                    tipo={tipo}
                    data={data}
                    refeicao={refeicao}
                    titulo={titulo}
                    setData={setData}
                    setRefeicao={setRefeicao}
                    setTitulo={setTitulo}
                    limparDados={limparDados}
                    gravaDados={gravaDados}
                />
            )}
            <div className="mb-4">
                <label htmlFor="datePicker" className="block text-lg font-medium text-gray-700 mb-2">
                    Selecione uma data:
                </label>
                <input
                    id="datePicker"
                    type="date"
                    value={dataSelecionada}
                    onChange={(e) => setDataSelecionada(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-2"
                />
            </div>
            {loading ? (
                <p>Carregando cardápios...</p>
            ) : (
                cardapiosFiltrados.length > 0 ? (
                    cardapiosFiltrados.map((item) => (
                        <CardapioItem
                            key={item.id}
                            item={item}
                            editarDados={editarDados}
                            apagarDados={apagarDados}
                            itens={itensPorCardapio[item.id]}
                            handleAvaliarClick={handleAvaliarClick}
                            mediaAvaliacoes={calcularMediaAvaliacoes}
                        />
                    ))
                ) : (
                    <p>Nenhum cardápio encontrado.</p>
                )
            )}
            {isModalOpen && <AvaliacoesModal cardapioId={selectedCardapioId} userId={userId} onClose={closeModal} />}
        </div>
    );
};

export default Cardapio;
