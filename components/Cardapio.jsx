'use client'

import React, { useEffect, useState } from "react";
import axios from "axios";
import AvaliacoesModal from "@components/AvaliacoesModal";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { addDays, subDays } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons';

// Componente de Item de Cardápio com exibição dos itens do cardápio
const CardapioItem = ({ item, itens, handleAvaliarClick, mediaAvaliacoes, session }) => (
    <div key={item.id} className="mt-6 mb-6 p-6 bg-white rounded-lg shadow-lg transition hover:shadow-xl transform hover:scale-105 duration-300 space-x-6">
        <div className="flex items-center justify-between mb-4">
            <div>
                <h3 className="text-lg font-bold text-gray-800">
                    {item.refeicao} - {item.titulo}
                </h3>
                <p className="text-sm text-gray-500">
                    {`Média de Avaliações: `}
                    <span className="text-orange-500 font-bold">{mediaAvaliacoes(item.id)}</span>
                </p>
            </div>
            {session && ( // Renderiza o botão apenas se o usuário estiver logado
                <button
                    onClick={() => handleAvaliarClick(item.id)}
                    className="bg-green-600 text-white px-5 py-2 rounded-md hover:bg-green-500 transition-colors duration-300 flex items-center space-x-2"
                >
                    <span>Avaliar</span>
                </button>
            )}
        </div>
        {itens && itens.length > 0 ? (
            <ul className="ml-4 list-disc space-y-4">
                {itens.map(subItem => (
                    <li key={subItem.id} className="flex items-center mb-4 space-x-4">
                        {/* Imagem do item à esquerda */}
                        <Image
                            src="assets/images/logo.svg"
                            width={40}
                            height={40}
                            className="object-contain"
                            alt={subItem.nome}
                        />

                        {/* Nome e descrição à direita */}
                        <div className="flex flex-col">
                            <strong className="text-md font-semibold text-gray-800">{subItem.nome}</strong>
                            <p className="text-sm text-gray-600">{subItem.descricao}</p>
                        </div>
                    </li>
                ))}
            </ul>

        ) : (
            <p className="ml-4 text-sm text-gray-500 italic">Nenhum item encontrado para este cardápio.</p>
        )}
    </div>
);

const Cardapio = () => {
    const { data: session } = useSession();
    const [cardapio, setCardapio] = useState([]);
    const [itensPorCardapio, setItensPorCardapio] = useState({});
    const [loading, setLoading] = useState(false);
    const [selectedCardapioId, setSelectedCardapioId] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [userId, setUserId] = useState("");
    const [avaliacoes, setAvaliacoes] = useState([]);
    const [today, setToday] = useState(new Date());

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

    const normalizarData = (data) => {
        return new Date(data).toLocaleDateString();
    };

    // Função para avançar um dia
    const handleNextDay = () => {
        setToday((prevDate) => addDays(prevDate, 1)); // Adiciona 1 dia à data atual
    };

    // Função para retroceder um dia
    const handlePreviousDay = () => {
        setToday((prevDate) => subDays(prevDate, 1)); // Subtrai 1 dia da data atual
    };

    // Filtrar os cardápios com base na data selecionada
    const cardapiosFiltrados = cardapio.filter((item) => {
        if (!today) return true;

        // Normaliza a data vinda do backend e a data selecionada
        const dataItemNormalizada = normalizarData(item.data);
        const dataSelecionadaNormalizada = normalizarData(today);

        return dataItemNormalizada === dataSelecionadaNormalizada;
    });

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
            <div className="flex justify-between items-center mb-4">
                <button
                    onClick={handlePreviousDay}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    <FontAwesomeIcon icon={faChevronLeft} className="mr-2" />
                    Dia Anterior
                </button>
                <button
                    onClick={handleNextDay}
                    className="flex items-center px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300"
                >
                    Próximo Dia
                    <FontAwesomeIcon icon={faChevronRight} className="ml-2" />
                </button>
            </div>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <p className="text-lg text-gray-600 flex items-center">
                        Carregando cardápios...
                    </p>
                </div>
            ) : (
                cardapiosFiltrados.length > 0 ? (
                    cardapiosFiltrados.map((item) => (
                        <CardapioItem
                            key={item.id}
                            item={item}
                            itens={itensPorCardapio[item.id]}
                            handleAvaliarClick={handleAvaliarClick}
                            mediaAvaliacoes={calcularMediaAvaliacoes}
                            session={session}
                        />
                    ))
                ) : (
                    <div className="flex justify-center items-center h-64">
                        <p className="text-lg text-gray-500">
                            Nenhum cardápio encontrado.
                        </p>
                    </div>
                )
            )}

            {isModalOpen && <AvaliacoesModal cardapioId={selectedCardapioId} userId={userId} onClose={closeModal} />}
        </div>
    );
};

export default Cardapio;
