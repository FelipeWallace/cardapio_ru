'use client'

import { useState, useEffect } from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import AdminGuard from "@components/AdminGuard";
import Notification from "@components/Notification";

export default function RemoverItemDoCardapio() {
    const [cardapios, setCardapios] = useState([]);
    const [selectedCardapioId, setSelectedCardapioId] = useState("");
    const [itens, setItens] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const url = process.env.NEXT_PUBLIC_API_URL;

    useEffect(() => {
        fetch(url + "cardapio")
            .then((response) => response.json())
            .then((data) => setCardapios(data))
            .catch((error) => setErrorMessage("Erro ao buscar cardápios:", error));
    }, []);

    useEffect(() => {
        if (selectedCardapioId) {
            fetch(url + `cardapio/${selectedCardapioId}/itens`)
                .then((response) => response.json())
                .then((data) => setItens(data))
                .catch((error) => setErrorMessage("Erro ao buscar itens do cardápio:", error));
        }
    }, [selectedCardapioId]);

    const filteredCardapios = cardapios.filter((cardapio) => {
        const dataFormatada = new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' });
        return (
            dataFormatada.includes(searchTerm) ||
            cardapio.refeicao.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cardapio.titulo.toLowerCase().includes(searchTerm.toLowerCase())
        );
    });

    const handleRemoveItem = (itemId) => {
        fetch(url + `cardapio/${selectedCardapioId}/remover-item/${itemId}`, {
            method: "DELETE",
        })
            .then((response) => response.json())
            .then((data) => {
                setSuccessMessage(data.message);
                setItens(itens.filter((item) => item.id !== itemId));
            })
            .catch((error) => setErrorMessage("Erro ao remover item do cardápio:", error));
    };

    return (
        <AdminGuard>
            <div className="container mx-auto p-4">

                <Notification message={successMessage} type="success" clearMessage={() => setSuccessMessage("")} />
                <Notification message={errorMessage} type="error" clearMessage={() => setErrorMessage("")} />

                <h2 className="text-xl font-bold mb-4">Selecionar Cardápio</h2>

                <input
                    type="text"
                    placeholder="Busque por data, título ou refeição"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="mb-2 p-2 border border-gray-300 rounded w-full"
                />

                <select
                    value={selectedCardapioId}
                    onChange={(e) => setSelectedCardapioId(e.target.value)}
                    className="mb-4 p-2 border border-gray-300 rounded w-full"
                >
                    <option value="">Selecione um cardápio</option>
                    {filteredCardapios.map((cardapio) => (
                        <option key={cardapio.id} value={cardapio.id}>
                            {new Date(cardapio.data).toLocaleDateString('pt-BR', { timeZone: 'UTC' })} - {cardapio.refeicao} - {cardapio.titulo}
                        </option>
                    ))}
                </select>

                {selectedCardapioId && itens.length > 0 && (
                    <div>
                        <h3 className="text-lg font-bold mb-4">Itens do Cardápio</h3>
                        <ul>
                            {itens.map((item) => (
                                <li key={item.id} className="flex items-center mb-4 space-x-4">
                                <img
                                    src={item.imagem_url ? item.imagem_url : "https://i.ibb.co/pbcBmrY/ae65dba955ffbad623f51d2fae50d7e4.jpg"}
                                    alt={item.nome}
                                    className="object-cover rounded w-10 h-10 transition duration-300 ease-in-out transform hover:scale-110"
                                />
                                <div className="flex flex-col flex-grow">
                                    <strong className="text-md font-semibold text-gray-800">{item.nome}</strong>
                                    <p className="text-sm text-gray-600">{item.descricao}</p>
                                </div>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    className="ml-auto bg-red-100 text-red-500 hover:text-red-700 hover:bg-red-200 transition duration-300 flex items-center p-2 rounded"
                                >
                                    <FontAwesomeIcon icon={faTrashAlt} className="mr-2" />
                                    Remover
                                </button>
                            </li>
                            
                            ))}
                        </ul>
                    </div>
                )}

                {selectedCardapioId && itens.length === 0 && (
                    <p>Nenhum item encontrado neste cardápio.</p>
                )}
            </div>
        </AdminGuard>
    );
}
